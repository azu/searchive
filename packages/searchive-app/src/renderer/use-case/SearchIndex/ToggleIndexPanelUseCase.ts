// MIT © 2017 azu
import { Payload, UseCase } from "almin";

export class DismissIndexPanelUseCasePayload extends Payload {}

export class DismissIndexPanelUseCase extends UseCase {
    type = "DismissIndexPanelUseCase";
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
