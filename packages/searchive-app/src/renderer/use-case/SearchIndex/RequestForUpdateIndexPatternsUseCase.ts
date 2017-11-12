// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { SearchiveDocumentIndex } from "searchive-client";
import { WebSocketTypes } from "searchive-web-api-interface";

export const requestToUpdateDataBaseIndex = (
    token: string,
    patterns: string[],
    onProgress: ((progress: number) => void)
): Promise<SearchiveDocumentIndex> => {
    return new Promise((resolve, reject) => {
        // WebSocket
        const socket = new WebSocket(`ws://localhost:12347?token=${encodeURIComponent(token)}`);
        socket.addEventListener("open", function() {
            socket.addEventListener("message", function(event) {
                try {
                    const message: WebSocketTypes.ServerToClientMessageTypes = JSON.parse(event.data);
                    if (message.type === WebSocketTypes.WebSocketServerToClientMessageType.progress) {
                        onProgress(message.progress);
                    } else if (message.type === WebSocketTypes.WebSocketServerToClientMessageType.completeIndexing) {
                        resolve();
                        socket.close();
                    } else if (message.type === WebSocketTypes.WebSocketServerToClientMessageType.error) {
                        throw new Error(message.message);
                    }
                } catch (error) {
                    socket.close();
                    reject(error);
                }
            });

            socket.send(
                JSON.stringify({
                    type: WebSocketTypes.WebSocketClientToServerMessageType.createIndex,
                    fileGlob: patterns
                })
            );
        });
    });
};

export class StartRequestForUpdateIndexPatternsUseCasPayload extends Payload {
    type = "StartRequestForUpdateIndexPatternsUseCasPayload";
}

export class ProgressRequestForUpdateIndexPatternsUseCasPayload extends Payload {
    type = "ProgressRequestForUpdateIndexPatternsUseCasPayload";

    constructor(public progress: number) {
        super();
    }
}

export class FinishRequestForUpdateIndexPatternsUseCasPayload extends Payload {
    type = "FinishRequestForUpdateIndexPatternsUseCasPayload";
}

export class RequestForUpdateIndexPatternsUseCase extends UseCase {
    execute(patterns: string[]) {
        const token = require("electron").remote.getGlobal("searchiveSharedToken");
        this.dispatch(new StartRequestForUpdateIndexPatternsUseCasPayload());
        return requestToUpdateDataBaseIndex(token, patterns, progress => {
            this.dispatch(new ProgressRequestForUpdateIndexPatternsUseCasPayload(progress));
        })
            .then(() => {
                this.dispatch(new FinishRequestForUpdateIndexPatternsUseCasPayload());
            })
            .catch(error => {
                console.error(error);
                alert(error.message);
                this.dispatch(new FinishRequestForUpdateIndexPatternsUseCasPayload());
            });
    }
}
