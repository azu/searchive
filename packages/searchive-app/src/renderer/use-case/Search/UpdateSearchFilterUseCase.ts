// MIT © 2017 azu
import { Payload, UseCase } from "almin";

export class UpdateSearchFilterUseCasePayload extends Payload {
    type = "UpdateSearchFilterUseCasePayload";

    constructor(public filterPattern: string) {
        super();
    }
}

export default class UpdateSearchFilterUseCase extends UseCase {
    execute(filterPattern: string) {
        this.dispatch(new UpdateSearchFilterUseCasePayload(filterPattern));
    }
}
