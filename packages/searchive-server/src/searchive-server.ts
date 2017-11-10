// MIT © 2017 azu
import restify = require("restify");
import { createIndexAPI } from "./api/create-index";
import { searchAPI } from "./api/search";
import { Next, Request, Response } from "restify";

const server = restify.createServer();
server.use(
    restify.plugins.queryParser({
        mapParams: true
    })
);
server.use(
    restify.plugins.bodyParser({
        mapParams: true
    })
);

if (process.env.NODE_ENV !== "production") {
    server.use(function crossOrigin(_req: Request, res: Response, next: Next) {
        res.header("Access-Control-Allow-Origin", `http://localhost:9080`);
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
    });
}

export interface SearchiveServerArgs {
    indexPath: string;
}

export class SearchiveServer {
    constructor(private args: SearchiveServerArgs) {}

    start(PORT: number = 12347) {
        server.post("/api/create-index", createIndexAPI(this.args));
        server.get("/api/search", searchAPI(this.args));
        server.listen(PORT, function() {
            console.log("%s listening at %s", server.name, server.url);
        });
    }

    close() {
        server.close();
    }
}
