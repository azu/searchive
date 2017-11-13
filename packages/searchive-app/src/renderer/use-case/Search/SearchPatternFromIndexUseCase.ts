// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { SearchiveDocument } from "searchive-client";

export const searchFromIndex = (pattern: string, token: string): Promise<SearchiveDocument[]> => {
    const pass = function(response: Response): Promise<Response> {
        if (!response.ok) {
            return Promise.reject(new Error(response.statusText));
        }
        return Promise.resolve(response);
    };
    const headers = new Headers();
    headers.append("Authorization", token);
    return fetch(`http://localhost:12347/api/search?text=${encodeURIComponent(pattern)}`, {
        headers
    })
        .then(pass)
        .then(res => res.json());
};

export class SearchPatternFromIndexUseCasePayload extends Payload {
    type = "SearchPatternFromIndexUseCasePayload";

    constructor(public searchPattern: string, public documents: SearchiveDocument[]) {
        super();
    }
}

export class SearchPatternFromIndexUseCase extends UseCase {
    execute(pattern: string) {
        const token = require("electron").remote.getGlobal("searchiveSharedToken");
        return searchFromIndex(pattern, token).then(documents => {
            this.dispatch(new SearchPatternFromIndexUseCasePayload(pattern, documents));
        });
    }
}
