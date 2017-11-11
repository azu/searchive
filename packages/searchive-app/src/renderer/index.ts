// MIT © 2017 azu
import { initializeIcons } from "@uifabric/icons";
// Register icons and pull the fonts from the default SharePoint cdn:
initializeIcons();

function requireAll(r: any) {
    r.keys().forEach(r);
}

requireAll(require.context("./", true, /\.css$/));
require("./index.css");
// index
import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./component/App";

ReactDOM.render(React.createElement(App), document.getElementById("app"));
