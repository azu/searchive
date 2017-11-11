// MIT © 2017 azu
import * as React from "react";
import { Panel, PanelType } from "office-ui-fabric-react";

export interface SearchIndexPanelProps {
    indexPatterns: string[];
    isOpen: boolean;
    onDismiss: () => void;
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
            />
        );
    }
}
