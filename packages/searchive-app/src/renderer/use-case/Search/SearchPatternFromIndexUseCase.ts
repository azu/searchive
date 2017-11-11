// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { SearchiveDocument } from "searchive-client";

export const searchFromIndex = (pattern: string): Promise<SearchiveDocument[]> => {
    const pass = function(response: Response): Promise<Response> {
        if (!response.ok) {
            return Promise.reject(new Error(response.statusText));
        }
        return Promise.resolve(response);
    };
    return fetch(`http://localhost:12347/api/search?text=${encodeURIComponent(pattern)}`)
        .then(pass)
        .then(res => res.json());
};

export class SearchPatternFromIndexUseCasePayload extends Payload {
    type = "SearchPatternFromIndexUseCasePayload";

    constructor(public documents: SearchiveDocument[]) {
        super();
    }
}

export class SearchPatternFromIndexUseCase extends UseCase {
    execute(pattern: string) {
        return searchFromIndex(pattern).then(documents => {
            this.dispatch(new SearchPatternFromIndexUseCasePayload(documents));
        });
    }
}
