import { Next, Request, Response } from "restify";
import { SearchiveDocumentIndex } from "searchive-client";
import * as fs from "fs";
import { SearchiveServerArgs } from "../searchive-server";

/**
 * Response with `indexPatterns`
 */
export const indexPatternAPI = (args: SearchiveServerArgs) => {
    return (_req: Request, res: Response, next: Next) => {
        try {
            const index: SearchiveDocumentIndex = JSON.parse(fs.readFileSync(args.indexPath, "utf-8"));
            res.send(200, {
                indexPatterns: index.indexPatterns
            });
        } catch (error) {
            // No Index, No Error
            res.send(200, {
                indexPatterns: []
            });
        }
        next();
    };
};
