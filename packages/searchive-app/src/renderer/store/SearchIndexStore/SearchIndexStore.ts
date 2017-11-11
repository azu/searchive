// MIT © 2017 azu
import { Store } from "almin";
import { UpdateSearchIndexUseCasePayload } from "../../use-case/SearchIndex/UpdateSearchIndexUseCase";

export interface SearchIndexState {
    indexPatterns: string[];
}

export class SearchIndexStore extends Store<SearchIndexState> {
    state: SearchIndexState;

    constructor() {
        super();
        this.state = {
            indexPatterns: []
        };
    }

    receivePayload(payload: UpdateSearchIndexUseCasePayload) {
        if (payload instanceof UpdateSearchIndexUseCasePayload) {
            this.setState({
                ...this.state,
                indexPatterns: payload.indexPatterns
            });
        }
    }

    getState() {
        return this.state;
    }
}
