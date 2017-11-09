#!/usr/bin/env node
"use strict";
const { searchIndex } = require("../lib/searchive-cli");
const meow = require("meow");
const path = require("path");

const cli = meow(`
    Usage
      $ searchive-search <input> --input <index-path>

    Options
      --input Input to read index json file

    Examples
      $ searchive-index "search word" --input index.json
`);
/*
{
    input: ['unicorns'],
    flags: {rainbow: true},
    ...
}
*/
const results = searchIndex(cli.input[0], path.resolve(process.cwd(), cli.flags.input));
if (results.length === 0) {
    console.log("No hit");
} else {
    results.forEach(result => {
        console.log(result);
    });
}
