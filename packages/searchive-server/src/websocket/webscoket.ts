import * as WebSocket from "ws";
import * as http from "http";
import * as https from "https";
import * as url from "url";
import { createHandlerCreateIndex } from "./api/create-index-ws";
import { SearchiveServerArgs } from "../searchive-server";
import { WebSocketTypes } from "searchive-web-api-interface";

export const createSender = (ws: WebSocket): WebSocketTypes.ServerToClientSender => {
    return (message: WebSocketTypes.ServerToClientMessageTypes) => {
        ws.send(JSON.stringify(message));
    };
};

export class WebSocketServer {
    wss: WebSocket.Server;

    constructor(private args: SearchiveServerArgs, private httpServer: http.Server | https.Server) {}

    start() {
        this.wss = new WebSocket.Server({ server: this.httpServer });
        const createIndex = createHandlerCreateIndex(this.args);
        this.wss.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
            const parsedUrl = url.parse(req.url!, true);
            const token = parsedUrl && parsedUrl.query && (parsedUrl.query as any).token;
            const send = createSender(ws);
            if (this.args.secretKey && this.args.secretKey !== token) {
                return send({
                    type: WebSocketTypes.WebSocketServerToClientMessageType.error,
                    message: "require ?token=xxx"
                });
            }
            //connection is up, let's add a simple simple event
            ws.on("message", async (message: string) => {
                try {
                    const parsedMessage: WebSocketTypes.ClientToServerMessageTypes = JSON.parse(message);
                    if (parsedMessage.type === WebSocketTypes.WebSocketClientToServerMessageType.createIndex) {
                        await createIndex(parsedMessage, send);
                    }
                } catch (error) {
                    console.error(error);
                    send({
                        type: WebSocketTypes.WebSocketServerToClientMessageType.error,
                        message: error.message
                    });
                }
            });
            send({
                type: WebSocketTypes.WebSocketServerToClientMessageType.connected
            });
        });
    }

    close() {
        this.wss.close();
    }
}
