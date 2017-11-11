// MIT © 2017 azu
import restify = require("restify");
import { createIndexAPI } from "./api/create-index";
import { searchAPI } from "./api/search";
const corsMiddleware = require("restify-cors-middleware");
const server = restify.createServer();
const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ["http://localhost:9080"]
});

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
server.pre(cors.preflight);
server.use(cors.actual);

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
