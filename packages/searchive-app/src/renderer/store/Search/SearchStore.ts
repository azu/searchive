// MIT © 2017 azu
import { Store } from "almin";
import { SearchiveDocument, SearchiveSearcher } from "searchive-client";
import { SearchPatternFromIndexUseCasePayload } from "../../use-case/Search/SearchPatternFromIndexUseCase";
import { UpdateSearchFilterUseCasePayload } from "../../use-case/Search/UpdateSearchFilterUseCase";

export interface SearchState {
    items: SearchiveDocument[];
    filteredItems: SearchiveDocument[];
    filter: undefined | string;
}

export const getFilterItems = (items: SearchiveDocument[], filter?: string) => {
    if (!filter) {
        return items;
    }
    const searcher = new SearchiveSearcher(items);
    return searcher.search(filter);
};

export class SearchStore extends Store<SearchState> {
    state: SearchState;

    constructor() {
        super();
        this.state = {
            items: [],
            filteredItems: [],
            filter: undefined
        };
    }

    receivePayload(payload: SearchPatternFromIndexUseCasePayload | UpdateSearchFilterUseCasePayload) {
        if (payload instanceof SearchPatternFromIndexUseCasePayload) {
            this.setState({
                ...this.state,
                items: payload.documents,
                filteredItems: getFilterItems(payload.documents)
            });
        } else if (payload instanceof UpdateSearchFilterUseCasePayload) {
            this.setState({
                ...this.state,
                filter: payload.filterPattern,
                filteredItems: getFilterItems(this.state.items, payload.filterPattern)
            });
        }
    }

    getState() {
        return this.state;
    }
}
