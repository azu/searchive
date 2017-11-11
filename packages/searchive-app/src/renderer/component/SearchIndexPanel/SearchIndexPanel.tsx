// MIT © 2017 azu
import React from "react";
import { Panel, PanelType, PrimaryButton } from "office-ui-fabric-react";
import { SearchIndexBar } from "../SearchIndexBar/SearchIndexBar";

export interface SearchIndexPanelProps {
    indexPatterns: string[];
    isOpen: boolean;
    onDismiss: () => void;
    onSubmit: (settingJSON: GitHubSettingJSON) => void;
}

export interface SearchIndexPanelState {}

export class SearchIndexPanel extends React.Component<SearchIndexPanelProps, SearchIndexPanelState> {
    state = {};

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
                <SearchIndexBar indexPatterns={this.props.indexPatterns} />
            </Panel>
        );
    }
}
