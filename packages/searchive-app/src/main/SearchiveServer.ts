// MIT © 2017 azu
import restify = require("restify");
import { createIndexAPI } from "./api/create-index";
import { searchAPI } from "./api/search";
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
server.post("/api/create-index", createIndexAPI);
server.post("/api/search", searchAPI);

export class SearchiveServer {
    constructor() {}

    start(PORT: number = 12347) {
        server.listen(PORT, function() {
            console.log("%s listening at %s", server.name, server.url);
        });
    }

    stop() {
        server.close();
    }
}
