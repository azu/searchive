// MIT © 2017 azu
import globby = require("globby");
import { pdfToJSON, PdfToJSONResult } from "pdf-to-json";
import * as os from "os";
import pLimit = require("p-limit");
import { SearchiveIndexer } from "searchive-client";

const limit = pLimit(os.cpus().length || 4);
const addRToIndex = (jsonList: PdfToJSONResult[]) => {
    const indexer = new SearchiveIndexer();
    indexer.setRef("id");
    indexer.addField("title");
    indexer.addField("author");
    indexer.addField("body");
    indexer.addField("filePath");
    indexer.addField("pageNumber");
    jsonList.forEach(result => {
        result.pages.forEach(page => {
            indexer.addDoc({
                id: `${result.filePath}:${page.pageNumber}`,
                title: result.meta.Title,
                author: result.meta.Author,
                body: page.texts.join("\n"),
                filePath: result.filePath,
                pageNumber: page.pageNumber
            });
        });
    });
    return indexer;
};

export const createIndex = (jsonList: PdfToJSONResult[]): Object => {
    return addRToIndex(jsonList).toJSON();
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
                    .catch((error: any) => {
                        console.error("Error", error);
                    });
            });
            return Promise.all(promises);
        })
        .then(() => {
            return results;
        });
};
