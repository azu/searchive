// MIT © 2017 azu
import globby = require("globby");
import pLimit = require("p-limit");
import pTimeout = require("p-timeout");
import * as os from "os";
import { SearchiveDocumentIndex, SearchiveIndexer } from "searchive-client";
import { pdfToJSON, PdfToJSONResult } from "pdf-to-json";

export interface PProgressInstance<T> extends Promise<T> {
    onProgress: (progressHandler: (progress: number) => void) => void;
}

const PProgress = require("p-progress");
const limit = pLimit(os.cpus().length || 4);
const expandToFileList = (globList: string[]): Promise<string[]> => {
    return globby(globList);
};
const readPdfJSON = (filePath: string): Promise<PdfToJSONResult> => {
    return limit(() => {
        return pdfToJSON(filePath);
    }) as Promise<PdfToJSONResult>;
};
const writePdfJSONToIndex = async (indexer: SearchiveIndexer, result: PdfToJSONResult): Promise<void> => {
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
};

export interface createIndexOptions {
    // Each progress timeout(msec). Default: 120 * 1000
    timeout?: number;
}

/**
 * create index and return PProgressInstance.
 * PProgressInstance that can be observe progressing by `PProgressInstance.onProgress(number => {}):`
 */
export const createIndex = (
    globList: string[],
    options: createIndexOptions = {}
): PProgressInstance<SearchiveDocumentIndex> => {
    const indexer = new SearchiveIndexer();
    const READ_TIMEOUT = options.timeout || 120 * 1000;
    return new PProgress(async (resolve: any, reject: any, progress: (progress: number) => void) => {
        const filePathList = await expandToFileList(globList);
        let currentProgress = 0;
        const totalNumber = filePathList.length;
        const promises = filePathList.map(filePath => {
            return (
                pTimeout(readPdfJSON(filePath), READ_TIMEOUT)
                    .then(result => {
                        return writePdfJSONToIndex(indexer, result);
                    })
                    // ignore error
                    .catch(error => {
                        console.error("Error in filePath:", filePath);
                        console.error(error);
                    })
                    .then(() => {
                        currentProgress++;
                        progress(currentProgress / totalNumber);
                    })
            );
        });
        return Promise.all(promises).then(() => {
            return resolve(indexer.toIndex(globList));
        }, reject);
    });
};
