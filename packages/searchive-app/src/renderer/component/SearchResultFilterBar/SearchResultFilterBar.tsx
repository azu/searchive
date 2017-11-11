// MIT © 2017 azu
import * as React from "react";
import { TextField } from "office-ui-fabric-react";

export interface SearchResultFilterBarProps {
    onChanged: (filterValue: string) => void;
}

export class SearchResultFilterBar extends React.Component<SearchResultFilterBarProps, {}> {
    render() {
        return (
            <div className="SearchResultFilterBar">
                <TextField addonString="Filter" onChanged={this.props.onChanged} />
            </div>
        );
    }
}
