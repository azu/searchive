// MIT © 2017 azu
import { Next, Request, Response } from "restify";
import { BadRequestError } from "restify-errors";
import * as fs from "fs";
import { createIndex, readAllAsJSON } from "searchive-create-index";

export const createIndexAPI = (req: Request, res: Response, next: Next) => {
    if (!req.body.fileGlob) {
        return next(new BadRequestError(`should include body: { fileGlob: "/path/**/*.pdf" }`));
    }
    console.log("req.body.fileGlob", req.body.fileGlob);
    readAllAsJSON(req.body.fileGlob)
        .then(results => {
            const index = createIndex(results);
            fs.writeFileSync(__dirname + "/index.json", JSON.stringify(index), "utf-8");
        })
        .then(() => {
            res.send(200, {
                status: "ok"
            });
            next();
        })
        .catch(error => {
            res.send(500, {
                status: error.message
            });
            next();
        });
};
