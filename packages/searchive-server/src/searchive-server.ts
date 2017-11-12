// MIT © 2017 azu
import restify = require("restify");
import { Request, Response, Next } from "restify";
import { createIndexAPI } from "./api/create-index";
import { searchAPI } from "./api/search";
import { WebSocketServer } from "./websocket/webscoket";
import { indexPatternAPI } from "./api/index-pattern";
import { NotAuthorizedError } from "restify-errors";

const corsMiddleware = require("restify-cors-middleware");
const server = restify.createServer();

export interface SearchiveServerArgs {
    indexPath: string;
    port?: number;
    // auth token
    secretKey?: string;
}

export class SearchiveServer {
    private port: number;
    private wsServer: WebSocketServer;

    constructor(private args: SearchiveServerArgs) {
        this.port = args.port !== undefined ? args.port : 12347;
        this.wsServer = new WebSocketServer(args, server);
    }

    start() {
        // middleware
        const cors = corsMiddleware({
            preflightMaxAge: 5, // Optional
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
        server.use((req: Request, _res: Response, next: Next) => {
            const token = req.headers["authorization"];
            if (this.args.secretKey && this.args.secretKey !== token) {
                next(new NotAuthorizedError("Invalid token. Need to set Authorization: xxx"));
            } else {
                next();
            }
        });
        server.pre(cors.preflight);
        server.use(cors.actual);
        // router
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
