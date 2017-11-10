// MIT © 2017 azu
import { SearchiveSearcher, SearchiveDocument } from "searchive-client";
import { createIndex, readAllAsJSON } from "searchive-create-index";
import * as fs from "fs";

export function writeIndex(globList: string[], outputPath: string): Promise<void> {
    return readAllAsJSON(globList).then(results => {
        return createIndex(results).then(index => {
            fs.writeFileSync(outputPath, JSON.stringify(index), "utf-8");
        });
    });
}

export function searchIndex(text: string, indexPath: string): string[] {
    const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
    const searcher = new SearchiveSearcher(index);
    return searcher
        .searchText(text)
        .map(hit => {
            return searcher.getDoc(hit.ref) as SearchiveDocument;
        })
        .filter(doc => doc !== undefined)
        .sort((a: SearchiveDocument, b: SearchiveDocument) => {
            return a.pageNumber - b.pageNumber;
        })
        .map((doc: SearchiveDocument) => {
            return `Title:${doc.title || "No title"}
Path: ${doc.filePath}
Page: ${doc.pageNumber}`;
        });
}
