// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { SearchiveDocumentIndex } from "searchive-client";

export const requestToUpdateDataBaseIndex = (patterns: string[]): Promise<SearchiveDocumentIndex> => {
    const pass = function<T extends Response>(response: T): Promise<T> {
        if (!response.ok) {
            return Promise.reject(new Error(response.statusText));
        }
        return Promise.resolve(response);
    };
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    return fetch(`http://localhost:12347/api/create-index`, {
        method: "post",
        headers: headers,
        body: JSON.stringify({
            fileGlob: patterns
        })
    })
        .then(pass)
        .then((res: Response) => res.json());
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
