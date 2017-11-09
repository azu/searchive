// MIT © 2017 azu
import { Next, Request, Response } from "restify";
import { BadRequestError } from "restify-errors";
import { SearchiveSearcher } from "searchive-client";
import * as fs from "fs";

export const searchAPI = (req: Request, res: Response, next: Next) => {
    if (!req.body.text) {
        return next(new BadRequestError(`should include body: { text: "search word" }`));
    }
    const index = JSON.parse(fs.readFileSync(__dirname + "/index.json", "utf-8"));
    const searcher = new SearchiveSearcher(index);
    const results = searcher.search(req.body.text);
    const response = results.map(result => {
        const doc = searcher.getDoc(result.ref);
        if (doc) {
            delete doc.body;
        }
        return doc;
    });
    res.send(200, response);
    next();
};
