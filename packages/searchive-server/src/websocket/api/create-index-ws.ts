// MIT © 2017 azu
import * as fs from "fs";
import { createIndex } from "searchive-create-index";
import { SearchiveServerArgs } from "../../searchive-server";
import { WebSocketTypes } from "searchive-web-api-interface";

export const createHandlerCreateIndex = (args: SearchiveServerArgs) => {
    return (message: WebSocketTypes.CreateIndexMessage, send: WebSocketTypes.ServerToClientSender) => {
        if (!message.fileGlob) {
            return send({
                type: WebSocketTypes.WebSocketServerToClientMessageType.error,
                message: `should include body: { fileGlob: "/path/**/*.pdf" }`
            });
        }
        const progressInstance = createIndex(message.fileGlob);
        progressInstance.onProgress(progress => {
            send({
                type: WebSocketTypes.WebSocketServerToClientMessageType.progress,
                progress
            });
        });
        return progressInstance.then(index => {
            fs.writeFileSync(args.indexPath, JSON.stringify(index), "utf-8");
            send({
                type: WebSocketTypes.WebSocketServerToClientMessageType.completeIndexing
            });
        });
    };
};
