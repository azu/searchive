// MIT © 2017 azu
import { Next, Request, Response } from "restify";
import { BadRequestError, ServiceUnavailableError } from "restify-errors";
import { SearchiveSearcher, SearchiveDocument } from "searchive-client";
import * as fs from "fs";
import { SearchiveServerArgs } from "../searchive-server";

export const searchAPI = (args: SearchiveServerArgs) => {
    return (req: Request, res: Response, next: Next) => {
        if (!req.params.text) {
            return next(new BadRequestError(`should include param: ?text=word `));
        }
        if (!fs.existsSync(args.indexPath)) {
            return next(new ServiceUnavailableError(`Not found index`));
        }
        const index = JSON.parse(fs.readFileSync(args.indexPath, "utf-8"));
        const searcher = new SearchiveSearcher(index);
        console.info("Search", req.params.text);
        const results = searcher.search(req.params.text);
        const response = results
            .map(hit => {
                return searcher.getDoc(hit.ref) as SearchiveDocument;
            })
            .filter(doc => doc !== undefined)
            .sort((a: SearchiveDocument, b: SearchiveDocument) => {
                return a.pageNumber - b.pageNumber;
            });
        res.send(200, response);
        next();
    };
};
