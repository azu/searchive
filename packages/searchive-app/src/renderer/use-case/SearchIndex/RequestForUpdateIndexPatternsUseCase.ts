// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { SearchiveDocumentIndex } from "searchive-client";

export const requestToUpdateDataBaseIndex = (patterns: string[]): Promise<SearchiveDocumentIndex> => {
    const pass = function(response: Response): Promise<Response> {
        if (!response.ok) {
            return Promise.reject(new Error(response.statusText));
        }
        return Promise.resolve(response);
    };
    return fetch(`http://localhost:12347/api/create-index`, {
        method: "post",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fileGlob: patterns
        })
    })
        .then(pass)
        .then(res => res.json());
};

export class StartRequestForUpdateIndexPatternsUseCasPayload extends Payload {
    type = "StartRequestForUpdateIndexPatternsUseCasPayload";
}

export class FinishRequestForUpdateIndexPatternsUseCasPayload extends Payload {
    type = "FinishRequestForUpdateIndexPatternsUseCasPayload";
}

export class RequestForUpdateIndexPatternsUseCase extends UseCase {
    execute(patterns: string[]) {
        this.dispatch(new StartRequestForUpdateIndexPatternsUseCasPayload());
        return requestToUpdateDataBaseIndex(patterns)
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
