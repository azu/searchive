// MIT © 2017 azu
import restify = require("restify");
import { createIndexAPI } from "./api/create-index";
import { searchAPI } from "./api/search";
import { WebSocketServer } from "./websocket/webscoket";
import { indexPatternAPI } from "./api/index-pattern";

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
    port?: number;
}

export class SearchiveServer {
    private port: number;
    private wsServer: WebSocketServer;

    constructor(private args: SearchiveServerArgs) {
        this.port = args.port !== undefined ? args.port : 12347;
        this.wsServer = new WebSocketServer(args, server);
    }

    start() {
        server.get("/api/index-patterns", indexPatternAPI(this.args));
        server.get("/api/search", searchAPI(this.args));
        server.post("/api/create-index", createIndexAPI(this.args));
        server.listen(this.port, function() {
            console.log(`Server started on port http://localhost:${server.address().port} :)`);
            console.log(`WebSocket Server started on port ws://localhost:${server.address().port} :)`);
        });
        this.wsServer.start();
    }

    close() {
        this.wsServer.close();
        server.close();
    }
}
