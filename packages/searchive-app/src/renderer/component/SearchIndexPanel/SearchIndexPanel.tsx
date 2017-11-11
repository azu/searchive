// MIT © 2017 azu
import * as React from "react";
import { Label, Panel, PanelType, Spinner, SpinnerSize } from "office-ui-fabric-react";
import { SearchIndexBar } from "../SearchIndexBar/SearchIndexBar";

export interface SearchIndexPanelProps {
    indexPatterns: string[];
    isOpen: boolean;
    isUpdatingDatabase: boolean;
    onDismiss: () => void;
    onSubmit: (indexPatterns: string[]) => void;
}

export interface SearchIndexPanelState {
    indexPatternValue: string;
}

export class SearchIndexPanel extends React.Component<SearchIndexPanelProps, SearchIndexPanelState> {
    render() {
        return (
            <Panel
                className="SearchIndexPanel"
                isOpen={this.props.isOpen}
                type={PanelType.medium}
                isLightDismiss={true}
                headerText="SearchIndex Settings"
                onDismiss={() => this.props.onDismiss()}
            >
                <SearchIndexBar indexPatterns={this.props.indexPatterns} onSubmit={this.props.onSubmit} />

                {this.props.isUpdatingDatabase ? (
                    <div>
                        <Label>Updating database</Label>
                        <Spinner size={SpinnerSize.large} />
                    </div>
                ) : null}
            </Panel>
        );
    }
}
