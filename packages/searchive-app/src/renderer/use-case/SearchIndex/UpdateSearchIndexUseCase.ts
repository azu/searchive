// MIT © 2017 azu
import { Payload, UseCase } from "almin";

export class UpdateSearchIndexUseCasePayload extends Payload {
    constructor(public indexPatterns: string[]) {
        super();
    }
}

export class UpdateSearchIndexUseCase extends UseCase {
    execute(indexPatterns: string[]) {
        this.dispatch(new UpdateSearchIndexUseCasePayload(indexPatterns));
    }
}
