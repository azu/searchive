// MIT © 2017 azu
import * as React from "react";
import { List } from "office-ui-fabric-react";
import { SearchiveDocument } from "searchive-client";

export interface SearchResultListProps {
    items: SearchiveDocument[];
}

export class SearchResultList extends React.Component<SearchResultListProps, {}> {
    render() {
        return <List items={this.props.items} onRenderCell={this._onRenderCell} />;
    }

    private _onRenderCell(item: SearchiveDocument): JSX.Element {
        return (
            <div className="SearchResultList-item" data-is-focusable={true}>
                <h1>
                    <a href={item.filePath} title={item.title}>
                        {item.title ? `${item.title}#${item.pageNumber}` : item.id}
                    </a>
                </h1>
                <p>{item.body}</p>
            </div>
        );
    }
}
