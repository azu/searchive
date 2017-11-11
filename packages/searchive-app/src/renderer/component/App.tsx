// MIT © 2017 azu
import * as React from "react";

import { SearchiveDocument, SearchiveDocumentIndex, SearchiveSearcher } from "searchive-client";
import { SearchBar } from "./SearchBar/SearchBar";
import { SearchResultList } from "./SearchResultList/SearchResultList";
import { SearchResultFilterBar } from "../../../lib/renderer/component/SearchResultFilterBar/SearchResultFilterBar";
import { SearchIndexBar } from "./SearchIndexBar/SearchIndexBar";
import { Context } from "almin";

export interface AppProps {
    context: Context<any>;
    items: SearchiveDocument[];
}

export class App extends React.Component<AppProps, {}> {
    state = {
        indexPatterns: [],
        items: [],
        filteredItems: [],
        filter: undefined
    };

    private getFilterItems = (items: SearchiveDocument[], filter?: string) => {
        if (!filter) {
            return items;
        }
        const searcher = new SearchiveSearcher(items);
        return searcher.search(filter);
    };

    onChangedFilter = (filterValue: string) => {
        this.setState({
            filter: filterValue,
            filteredItems: this.getFilterItems(this.state.items, filterValue)
        });
    };

    onClear = () => {
        this.setState({
            filteredItems: this.getFilterItems(this.state.items)
        });
    };

    onSearch = (text: string) => {
        const pass = function(response: Response): Promise<Response> {
            if (!response.ok) {
                return Promise.reject(new Error(response.statusText));
            }
            return Promise.resolve(response);
        };
        fetch(`http://localhost:12347/api/search?text=${encodeURIComponent(text)}`)
            .then(pass)
            .then(res => res.json())
            .then((documentIndex: SearchiveDocumentIndex) => {
                this.setState({
                    indexPatterns: documentIndex.indexPatterns,
                    items: documentIndex.documents,
                    filteredItems: this.getFilterItems(documentIndex.documents, this.state.filter)
                });
            })
            .catch(error => {
                console.error(error);
            });
    };

    render() {
        return (
            <div className="App">
                <div>
                    <SearchIndexBar indexPatterns={} onSearch={this.onSearch} />
                </div>
                <div>
                    <SearchBar onClear={this.onClear} onSearch={this.onSearch} />
                    <SearchResultFilterBar onChanged={this.onChangedFilter} />
                </div>
                <div>
                    <span>検索結果: {this.state.filteredItems.length}件</span>
                    <SearchResultList items={this.state.filteredItems} />
                </div>
            </div>
        );
    }
}
