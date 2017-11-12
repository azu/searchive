// MIT © 2017 azu
import { Store } from "almin";
import { UpdateSearchIndexUseCasePayload } from "../../use-case/SearchIndex/UpdateSearchIndexUseCase";
import {
    DismissIndexPanelUseCasePayload,
    ShowIndexPanelUseCasePayload
} from "../../use-case/SearchIndex/ToggleIndexPanelUseCase";
import {
    FinishRequestForUpdateIndexPatternsUseCasPayload,
    ProgressRequestForUpdateIndexPatternsUseCasPayload,
    StartRequestForUpdateIndexPatternsUseCasPayload
} from "../../use-case/SearchIndex/RequestForUpdateIndexPatternsUseCase";

export interface SearchIndexState {
    indexPatterns: string[];
    isPanelShown: boolean;
    // 0...1
    updatingProgress: number;
    isUpdatingDatabase: boolean;
}

export class SearchIndexStore extends Store<SearchIndexState> {
    state: SearchIndexState;

    constructor() {
        super();
        this.state = {
            indexPatterns: [],
            isPanelShown: false,
            updatingProgress: 0,
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
            | any
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
        } else if (payload instanceof ProgressRequestForUpdateIndexPatternsUseCasPayload) {
            this.setState({
                ...this.state,
                updatingProgress: payload.progress
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
