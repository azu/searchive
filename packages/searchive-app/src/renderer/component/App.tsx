// MIT © 2017 azu
import * as React from "react";
import { SearchBar } from "./SearchBar/SearchBar";
import { SearchResultList } from "./SearchResultList/SearchResultList";
import { SearchResultFilterBar } from "../../../lib/renderer/component/SearchResultFilterBar/SearchResultFilterBar";
import { SearchIndexBar } from "./SearchIndexBar/SearchIndexBar";
import { Context } from "almin";
import { appStoreGroup } from "../store/AppStoreGroup";
import UpdateSearchFilterUseCase from "../use-case/Search/UpdateSearchFilterUseCase";
import { SearchPatternFromIndexUseCase } from "../use-case/Search/SearchPatternFromIndexUseCase";

export interface AppProps {
    context: Context<any>;
}

export class App extends React.Component<typeof appStoreGroup.state & AppProps, {}> {
    onChangedFilter = (filterValue: string) => {
        this.props.context.useCase(new UpdateSearchFilterUseCase()).executor(useCase => useCase.execute(filterValue));
    };

    onClear = () => {};

    onSearch = (text: string) => {
        this.props.context.useCase(new SearchPatternFromIndexUseCase()).executor(useCase => useCase.execute(text));
    };

    render() {
        return (
            <div className="App">
                <div>
                    <SearchIndexBar indexPatterns={this.props.index.indexPatterns} onChanged={() => {}} />
                </div>
                <div>
                    <SearchBar onClear={this.onClear} onSearch={this.onSearch} />
                    <SearchResultFilterBar onChanged={this.onChangedFilter} />
                </div>
                <div>
                    <span>検索結果: {this.props.search.filteredItems.length}件</span>
                    <SearchResultList items={this.props.search.filteredItems} />
                </div>
            </div>
        );
    }
}
