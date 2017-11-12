/**
 * API Type Definition
 */

/**
 * Client to Server message
 */
export type ClientToServerSender = (message: ClientToServerMessageTypes) => void;
export type ClientToServerMessageTypes = CreateIndexMessage;

export enum WebSocketClientToServerMessageType {
    createIndex = "createIndex"
}

export interface CreateIndexMessage {
    type: WebSocketClientToServerMessageType.createIndex;
    fileGlob: string[];
}

/**
 * Server to Client message
 */

export type ServerToClientSender = (message: ServerToClientMessageTypes) => void;
export type ServerToClientMessageTypes =
    | ServerToClientErrorMessage
    | ServerToClientIndexProgressMessage
    | ServerToClientConnectedMessage
    | ServerToClientCompleteIndexMessage;

export enum WebSocketServerToClientMessageType {
    connected = "connected",
    error = "error",
    progress = "create-index-progress",
    completeIndexing = "complete-indexing"
}

export interface ServerToClientConnectedMessage {
    type: WebSocketServerToClientMessageType.connected;
}

export interface ServerToClientErrorMessage {
    type: WebSocketServerToClientMessageType.error;
    message: string;
}

export interface ServerToClientIndexProgressMessage {
    type: WebSocketServerToClientMessageType.progress;
    progress: number;
}

export interface ServerToClientCompleteIndexMessage {
    type: WebSocketServerToClientMessageType.completeIndexing;
}
