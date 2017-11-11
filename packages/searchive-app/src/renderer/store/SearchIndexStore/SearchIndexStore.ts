// MIT © 2017 azu
import { Store } from "almin";
import { UpdateSearchIndexUseCasePayload } from "../../use-case/SearchIndex/UpdateSearchIndexUseCase";
import {
    DismissIndexPanelUseCasePayload,
    ShowIndexPanelUseCasePayload
} from "../../use-case/SearchIndex/ToggleIndexPanelUseCase";
import {
    FinishRequestForUpdateIndexPatternsUseCasPayload,
    StartRequestForUpdateIndexPatternsUseCasPayload
} from "../../use-case/SearchIndex/RequestForUpdateIndexPatternsUseCase";

export interface SearchIndexState {
    indexPatterns: string[];
    isPanelShown: boolean;
    isUpdatingDatabase: boolean;
}

export class SearchIndexStore extends Store<SearchIndexState> {
    state: SearchIndexState;

    constructor() {
        super();
        this.state = {
            indexPatterns: [],
            isPanelShown: false,
            isUpdatingDatabase: false
        };
    }

    receivePayload(
        payload:
            | UpdateSearchIndexUseCasePayload
            | ShowIndexPanelUseCasePayload
            | DismissIndexPanelUseCasePayload
            | StartRequestForUpdateIndexPatternsUseCasPayload
            | FinishRequestForUpdateIndexPatternsUseCasPayload
    ) {
        if (payload instanceof UpdateSearchIndexUseCasePayload) {
            this.setState({
                ...this.state,
                indexPatterns: payload.indexPatterns
            });
        } else if (payload instanceof ShowIndexPanelUseCasePayload) {
            this.setState({
                ...this.state,
                isPanelShown: true
            });
        } else if (payload instanceof DismissIndexPanelUseCasePayload) {
            this.setState({
                ...this.state,
                isPanelShown: false
            });
        } else if (payload instanceof StartRequestForUpdateIndexPatternsUseCasPayload) {
            this.setState({
                ...this.state,
                isUpdatingDatabase: true
            });
        } else if (payload instanceof FinishRequestForUpdateIndexPatternsUseCasPayload) {
            this.setState({
                ...this.state,
                isUpdatingDatabase: false
            });
        }
    }

    getState() {
        return this.state;
    }
}
