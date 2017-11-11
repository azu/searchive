// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { SearchiveDocumentIndex } from "searchive-client";

export const searchFromIndex = (pattern: string): Promise<SearchiveDocumentIndex> => {
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
    constructor(public index: SearchiveDocumentIndex) {
        super();
    }
}

export class SearchPatternFromIndexUseCase extends UseCase {
    execute(pattern: string) {
        return searchFromIndex(pattern).then(index => {
            this.dispatch(new SearchPatternFromIndexUseCasePayload(index));
        });
    }
}
