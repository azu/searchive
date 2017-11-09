// MIT © 2017 azu
import globby = require("globby");
import { pdfToJSON, PdfToJSONResult } from "pdf-to-json";
import * as os from "os";

const lunr = require("elasticlunr");
// set english and japanese
require("lunr-languages/lunr.stemmer.support.js")(lunr);
require("lunr-language-jp")(lunr);
require("lunr-languages/lunr.multi.js")(lunr);
lunr.multiLanguage("en", "jp");

import pLimit = require("p-limit");

const limit = pLimit(os.cpus().length || 4);
export const createSearcher = (jsonList: PdfToJSONResult[]) => {
    return lunr(function(this: any) {
        this.use(lunr.multiLanguage("en", "jp"));
        this.setRef("id");
        this.addField("title");
        this.addField("author");
        this.addField("body");
        this.addField("filePath");
        this.addField("pageNumber");
        jsonList.forEach(result => {
            result.pages.forEach(page => {
                this.addDoc({
                    id: `${result.filePath}:${page.pageNumber}`,
                    title: result.meta.Title,
                    author: result.meta.Author,
                    body: page.texts.join("\n"),
                    filePath: result.filePath,
                    pageNumber: page.pageNumber
                });
            });
        });
    });
};

export const createIndex = (jsonList: PdfToJSONResult[]): Object => {
    return createSearcher(jsonList).toJSON();
};

export const readAllAsJSON = (globList: string[]): Promise<PdfToJSONResult[]> => {
    const results: PdfToJSONResult[] = [];
    return globby(globList)
        .then(paths => {
            const promises = paths.map(filePath => {
                return limit(() => {
                    console.log(`Process ${filePath}`);
                    return pdfToJSON(filePath);
                })
                    .then((result: PdfToJSONResult) => {
                        console.log(`Finish ${filePath}`);
                        results.push(result);
                    })
                    .catch(error => {
                        console.error("Error", error);
                    });
            });
            return Promise.all(promises);
        })
        .then(() => {
            return results;
        });
};
