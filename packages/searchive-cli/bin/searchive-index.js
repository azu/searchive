#!/usr/bin/env node
"use strict";
const { writeIndex } = require("../lib/searchive-cli");
const meow = require("meow");

const cli = meow(`
    Usage
      $ searchive-index <input>|<glob> --output <path>

    Options
      --output Output to write index json file

    Examples
      $ searchive-index "/your/book/**/*.pdf" --output index.json
`);
/*
{
    input: ['unicorns'],
    flags: {rainbow: true},
    ...
}
*/
writeIndex(cli.input[0], cli.flags.output)
    .then(() => {
        console.log("Write");
    })
    .catch(error => {
        console.error(error);
    });
