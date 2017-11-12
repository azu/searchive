// MIT © 2017 azu
import * as React from "react";
import { List } from "office-ui-fabric-react";
import { SearchiveDocument } from "searchive-client";
import * as path from "path";

const Highlighter = require("react-highlight-words");
declare var __static: string;
const { BrowserWindow } = require("electron").remote;
const PDFViewerPath = path.resolve(path.join(__static, "pdfjs/web/viewer.html"));

export interface SearchResultListProps {
    highLightKeyWords: string[];
    items: SearchiveDocument[];
}

export class SearchResultList extends React.Component<SearchResultListProps, {}> {
    render() {
        return <List items={this.props.items} onRenderCell={this._onRenderCell} />;
    }

    onClickItem = (item: SearchiveDocument) => {
        const win = new BrowserWindow();
        const fileUrl = item.filePath.replace(/^\//, "file:///");
        console.log(PDFViewerPath, fileUrl);
        win.loadURL(`file://${PDFViewerPath}?file=${encodeURIComponent(fileUrl)}#page=${item.pageNumber}`);
    };

    private _onRenderCell = (item: SearchiveDocument): JSX.Element => {
        return (
            <div className="SearchResultList-item" data-is-focusable={true}>
                <h1>
                    <a
                        href={item.filePath}
                        title={item.title}
                        onClick={(event: React.SyntheticEvent<any>) => {
                            event.preventDefault();
                            this.onClickItem(item);
                        }}
                    >
                        {item.title ? `${item.title}#${item.pageNumber}` : item.id}
                    </a>
                </h1>
                <Highlighter
                    highlightClassName="highlight"
                    searchWords={this.props.highLightKeyWords}
                    autoEscape={true}
                    textToHighlight={item.body}
                />
            </div>
        );
    };
}
