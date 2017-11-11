// MIT © 2017 azu
import * as React from "react";
import { TextField } from "office-ui-fabric-react";

export interface SearchIndexBarProps {
    indexPatterns: string[];
    onChanged: (filterValue: string) => void;
}

export class SearchIndexBar extends React.Component<SearchIndexBarProps, {}> {
    state = {
        value: ""
    };

    private indexToString(indexes: string[] | string): string {
        if (typeof indexes === "string") {
            return indexes;
        } else {
            return indexes.join(", ");
        }
    }

    componentWillReceiveProps(nextProps: SearchIndexBarProps) {
        const patternString = this.indexToString(nextProps.indexPatterns);
        if (this.state.value !== patternString) {
            this.setState({
                value: patternString
            });
        }
    }

    render() {
        return (
            <div className="SearchIndexBar">
                <TextField addonString="Index Patterns" value={this.state.value} onChanged={this.props.onChanged} />
            </div>
        );
    }
}
