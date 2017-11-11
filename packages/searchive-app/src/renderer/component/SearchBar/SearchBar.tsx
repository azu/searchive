// MIT © 2017 azu
import * as React from "react";
import { SearchBox } from "office-ui-fabric-react";

export interface SearchBarProps {
    onClear: () => void;
    onSearch: (text: string) => void;
}

export class SearchBar extends React.Component<SearchBarProps, {}> {
    render() {
        return (
            <SearchBox
                className="SearchBar"
                onClear={this.props.onClear}
                onSearch={this.props.onSearch}
                underlined={true}
            />
        );
    }
}
