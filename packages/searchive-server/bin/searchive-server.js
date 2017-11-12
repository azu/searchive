#!/usr/bin/env node
"use strict";
const meow = require("meow");
const path = require("path");

const cli = meow(`
	Usage
	  $ searchive-index --index-path /path/to/index.json

	Options
	  --index-path path to index.json that are written and read
	  --secretKey Token to authorize(Optional)

	Examples
	  $ searchive-index --index-path /path/to/index.json
`);
/*
{
	input: ['unicorns'],
	flags: {rainbow: true},
	...
}
*/
if (!cli.flags.indexPath) {
    cli.showHelp(1);
}
const SearchiveServer = require("../lib/searchive-server").SearchiveServer;
const server = new SearchiveServer({
    indexPath: path.resolve(process.cwd(), cli.flags.indexPath),
    secretKey: cli.flags.secretKey
});
server.start();
process.on("exit", function() {
    server.close();
});
process.on("uncaughtException", function(err) {
    console.error(err);
});
