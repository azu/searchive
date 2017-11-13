// MIT © 2017 azu
import { Store } from "almin";
import { SearchiveDocument, SearchiveSearcher } from "searchive-client";
import { SearchPatternFromIndexUseCasePayload } from "../../use-case/Search/SearchPatternFromIndexUseCase";
import { UpdateSearchFilterUseCasePayload } from "../../use-case/Search/UpdateSearchFilterUseCase";

export interface SearchState {
    searchPattern: string;
    items: SearchiveDocument[];
    filteredItems: SearchiveDocument[];
    filter: undefined | string;
    highLightKeyWords: string[];
}

export const getFilterItems = (items: SearchiveDocument[], filter?: string) => {
    if (!filter) {
        return items;
    }
    const searcher = new SearchiveSearcher(items);
    return searcher.search(filter);
};

export const highlightKeyWords = (searchText: string, filterText: string = ""): string[] => {
    // searchive-client
    const removedKeyWordsFromSearch = searchText.replace(/(AND|OR|NOT|:\w+:)/g, "");
    const removedKeyWordsFromFilter = filterText.replace(/(AND|OR|NOT|:\w+:)/g, "");
    return `${removedKeyWordsFromSearch} ${removedKeyWordsFromFilter}`.split(/\s+/);
};

export class SearchStore extends Store<SearchState> {
    state: SearchState;

    constructor() {
        super();
        this.state = {
            searchPattern: "",
            items: [],
            filteredItems: [],
            filter: undefined,
            highLightKeyWords: []
        };
    }

    receivePayload(payload: SearchPatternFromIndexUseCasePayload | UpdateSearchFilterUseCasePayload) {
        if (payload instanceof SearchPatternFromIndexUseCasePayload) {
            this.setState({
                ...this.state,
                searchPattern: payload.searchPattern,
                highLightKeyWords: highlightKeyWords(payload.searchPattern, this.state.filter),
                items: payload.documents,
                filteredItems: getFilterItems(payload.documents)
            });
        } else if (payload instanceof UpdateSearchFilterUseCasePayload) {
            this.setState({
                ...this.state,
                highLightKeyWords: highlightKeyWords(this.state.searchPattern, payload.filterPattern),
                filter: payload.filterPattern,
                filteredItems: getFilterItems(this.state.items, payload.filterPattern)
            });
        }
    }

    getState() {
        return this.state;
    }
}
