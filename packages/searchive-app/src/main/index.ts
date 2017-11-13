"use strict";
import { app, BrowserWindow, shell, Menu } from "electron";
import { SearchiveServer } from "searchive-server";

const autoUpdater = require("electron-updater").autoUpdater;
const defaultMenu = require("electron-default-menu");
import * as path from "path";

const isDevelopment = process.env.NODE_ENV !== "production";
// Global reference to mainWindow
// Necessary to prevent win from being garbage collected
let mainWindow: BrowserWindow | null;
let server: SearchiveServer | null;

const randomToken = (): string => {
    return require("crypto")
        .randomBytes(8)
        .toString("hex");
};
declare global {
    namespace NodeJS {
        interface Global {
            searchiveSharedToken: string;
        }
    }
}
// Shared Token
global.searchiveSharedToken = randomToken();

function createMainWindow() {
    // Construct new BrowserWindow
    const window = new BrowserWindow();

    // Set url for `win`
    // points to `webpack-dev-server` in development
    // points to `index.html` in production
    const url = isDevelopment
        ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
        : `file://${__dirname}/index.html`;

    if (isDevelopment) {
        window.webContents.openDevTools();
    }
    window.maximize();
    window.loadURL(url);

    window.on("closed", () => {
        mainWindow = null;
    });

    return window;
}

// Quit application when all windows are closed
app.on("window-all-closed", () => {
    // On macOS it is common for applications to stay open
    // until the user explicitly quits
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    // On macOS it is common to re-create a window
    // even after all windows have been closed
    if (mainWindow === null) mainWindow = createMainWindow();
});

// Create main BrowserWindow when electron is ready
app.on("ready", () => {
    const menu = defaultMenu(app, shell);
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
    // window
    mainWindow = createMainWindow();
    const indexPath = path.join(app.getPath("userData"), "searchive-app.index.json");
    console.log("Index Path: ", indexPath);
    server = new SearchiveServer({
        indexPath: indexPath,
        secretKey: global.searchiveSharedToken
    });
    server.start();
    // auto update
    autoUpdater.checkForUpdatesAndNotify();
});
