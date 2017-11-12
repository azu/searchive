// MIT © 2017 azu
import * as React from "react";
import { PrimaryButton, TextField } from "office-ui-fabric-react";

export interface SearchIndexBarProps {
    indexPatterns: string[];
    onSubmit: (indexPatterns: string[]) => void;
}

export class SearchIndexBar extends React.Component<SearchIndexBarProps, {}> {
    state = {
        value: this.indexToString(this.props.indexPatterns)
    };

    private indexToString(indexes: string[] | string): string {
        if (typeof indexes === "string") {
            return indexes;
        } else {
            return indexes.join("\n");
        }
    }

    private splitToIndex(text: string): string[] {
        return text.split("\n").map(pattern => pattern.trim());
    }

    private onSubmit = () => {
        this.props.onSubmit(this.splitToIndex(this.state.value));
    };

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
                <TextField
                    label="Index Patterns: Path or Glob pattern."
                    description="Want to specify multiple patterns, write pattern line by line."
                    value={this.state.value}
                    multiline
                    rows={5}
                    onChanged={(newValue: string) => {
                        this.setState({
                            value: newValue
                        });
                    }}
                />
                <PrimaryButton onClick={this.onSubmit}>Save</PrimaryButton>
            </div>
        );
    }
}
