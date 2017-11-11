// MIT © 2017 azu
import * as React from "react";
import { SearchBar } from "./SearchBar/SearchBar";
import { SearchResultList } from "./SearchResultList/SearchResultList";
import { SearchResultFilterBar } from "../../../lib/renderer/component/SearchResultFilterBar/SearchResultFilterBar";
import { Context } from "almin";
import { appStoreGroup } from "../store/AppStoreGroup";
import UpdateSearchFilterUseCase from "../use-case/Search/UpdateSearchFilterUseCase";
import { SearchPatternFromIndexUseCase } from "../use-case/Search/SearchPatternFromIndexUseCase";
import { SearchIndexPanel } from "./SearchIndexPanel/SearchIndexPanel";
import { DismissIndexPanelUseCase, ShowIndexPanelUseCase } from "../use-case/SearchIndex/ToggleIndexPanelUseCase";
import { RequestForUpdateIndexPatternsUseCase } from "../use-case/SearchIndex/RequestForUpdateIndexPatternsUseCase";
import { CommandBar, ContextualMenuItemType } from "office-ui-fabric-react";

export interface AppProps {
    context: Context<any>;
}

export class App extends React.Component<typeof appStoreGroup.state & AppProps, {}> {
    onChangedFilter = (filterValue: string) => {
        this.props.context.useCase(new UpdateSearchFilterUseCase()).executor(useCase => useCase.execute(filterValue));
    };

    onClear = () => {};

    onShowIndexPanel = () => {
        this.props.context.useCase(new ShowIndexPanelUseCase()).executor(useCase => useCase.execute());
    };

    onDismissIndexPanel = () => {
        this.props.context.useCase(new DismissIndexPanelUseCase()).executor(useCase => useCase.execute());
    };

    onSubmitIndexPanel = (indexPatterns: string[]) => {
        this.props.context
            .useCase(new RequestForUpdateIndexPatternsUseCase())
            .executor(useCase => useCase.execute(indexPatterns));
    };

    onSearch = (text: string) => {
        this.props.context.useCase(new SearchPatternFromIndexUseCase()).executor(useCase => useCase.execute(text));
    };

    render() {
        return (
            <div className="App">
                <SearchIndexPanel
                    isOpen={this.props.index.isPanelShown}
                    isUpdatingDatabase={this.props.index.isUpdatingDatabase}
                    indexPatterns={this.props.index.indexPatterns}
                    onDismiss={this.onDismissIndexPanel}
                    onSubmit={this.onSubmitIndexPanel}
                />

                <CommandBar
                    isSearchBoxVisible={false}
                    items={[
                        {
                            key: "index",
                            name: "Index Database",
                            icon: "Database",
                            subMenuProps: {
                                items: [
                                    {
                                        key: "index.setting",
                                        name: "Open Index setting",
                                        icon: "Settings",
                                        onClick: this.onShowIndexPanel
                                    },
                                    {
                                        key: "divider_1",
                                        itemType: ContextualMenuItemType.Divider
                                    },
                                    {
                                        key: "index.refresh",
                                        name: "Refresh current index",
                                        icon: "Refresh"
                                    }
                                ]
                            }
                        }
                    ]}
                />
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
