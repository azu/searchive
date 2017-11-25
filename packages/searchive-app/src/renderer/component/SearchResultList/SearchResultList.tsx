// MIT © 2017 azu
import * as React from "react";
import { remote } from "electron";
import { IconButton, Link, List } from "office-ui-fabric-react";
import { SearchiveDocument } from "searchive-client";
import * as path from "path";

const shell = remote.shell;

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

    onClickOpenFile = (item: SearchiveDocument) => {
        const fileUrl = item.filePath.replace(/^\//, "file:///");
        shell.openExternal(fileUrl);
    };

    onClickLink = (item: SearchiveDocument) => {
        const win = new BrowserWindow();
        const fileUrl = item.filePath.replace(/^\//, "file:///");
        win.loadURL(`file://${PDFViewerPath}?file=${encodeURIComponent(fileUrl)}#page=${item.pageNumber}`);
    };

    private _onRenderCell = (item: SearchiveDocument): JSX.Element => {
        return (
            <div className="SearchResultList-item" data-is-focusable={true}>
                <h1 className="SearchResultList-itemTitle">
                    <IconButton
                        className="SearchResultList-itemTitleOpen"
                        iconProps={{
                            iconName: "OpenFile"
                        }}
                        onClick={(event: React.SyntheticEvent<any>) => {
                            event.preventDefault();
                            this.onClickOpenFile(item);
                        }}
                    >
                        Open File
                    </IconButton>
                    <Link
                        className="SearchResultList-itemTitleLink"
                        href={item.filePath}
                        title={item.title}
                        onClick={(event: React.SyntheticEvent<any>) => {
                            event.preventDefault();
                            this.onClickLink(item);
                        }}
                    >
                        {item.title ? `${item.title}#${item.pageNumber}` : item.id}
                    </Link>
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
