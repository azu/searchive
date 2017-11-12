// MIT © 2017 azu
import { Payload, UseCase } from "almin";

export class DismissIndexPanelUseCasePayload extends Payload {
    type = "DismissIndexPanelUseCase";
}

export class DismissIndexPanelUseCase extends UseCase {
    execute() {
        this.dispatch(new DismissIndexPanelUseCasePayload());
    }
}

export class ShowIndexPanelUseCasePayload extends Payload {
    type = "ShowIndexPanelUseCasePayload";
}

export class ShowIndexPanelUseCase extends UseCase {
    execute() {
        this.dispatch(new ShowIndexPanelUseCasePayload());
    }
}
