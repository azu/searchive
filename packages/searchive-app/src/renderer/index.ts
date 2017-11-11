// MIT © 2017 azu
import { initializeIcons } from "@uifabric/icons";
// index
import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./component/App";
import { Context, Dispatcher } from "almin";
import { appStoreGroup } from "./store/AppStoreGroup";
import { AlminLogger } from "almin-logger";
import AlminReactContainer from "almin-react-container";
// Register icons and pull the fonts from the default SharePoint cdn:
initializeIcons();

function requireAll(r: any) {
    r.keys().forEach(r);
}

requireAll(require.context("./", true, /\.css$/));
require("./index.css");

// instances
const dispatcher = new Dispatcher();
// context connect dispatch with stores
const context = new Context({
    dispatcher,
    store: appStoreGroup,
    options: {
        strict: true,
        performanceProfile: process.env.NODE_ENV !== "production"
    }
});
if (process.env.NODE_ENV !== "production") {
    const logger = new AlminLogger();
    logger.startLogging(context);
}
const Container = AlminReactContainer.create(App, context);
ReactDOM.render(
    React.createElement(Container, {
        context
    }),
    document.getElementById("app")
);
