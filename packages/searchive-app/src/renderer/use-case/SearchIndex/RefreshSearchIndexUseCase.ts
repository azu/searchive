// fetch and save
import { UseCase } from "almin";
import { UpdateSearchIndexUseCase } from "./UpdateSearchIndexUseCase";

export const fetchIndexPattern = (): Promise<{
    indexPatterns: string[];
}> => {
    const pass = function(response: Response): Promise<Response> {
        if (!response.ok) {
            return Promise.reject(new Error(response.statusText));
        }
        return Promise.resolve(response);
    };
    return fetch(`http://localhost:12347/api/index-patterns`)
        .then(pass)
        .then(res => res.json());
};

export class RefreshSearchIndexUseCase extends UseCase {
    execute() {
        return fetchIndexPattern().then(response => {
            this.context
                .useCase(new UpdateSearchIndexUseCase())
                .executor(useCase => useCase.execute(response.indexPatterns));
        });
    }
}
