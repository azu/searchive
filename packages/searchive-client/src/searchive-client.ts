// MIT © 2017 azu
const lunr = require("elasticlunr");
// set english and japanese
require("lunr-languages/lunr.stemmer.support.js")(lunr);
require("lunr-language-jp")(lunr);
require("lunr-languages/lunr.multi.js")(lunr);
lunr.multiLanguage("en", "jp");

export interface SearchiveDocument {
    id: string;
    title?: string;
    author?: string;
    body: string;
    filePath: string;
    pageNumber: number;
}

export interface SearchiveSearchIndexer {
    use(...plugins: any[]): void;

    setRef(ref: string): void;

    addField(field: string): void;

    addDoc(doc: SearchiveDocument): void;

    toJSON(): Object;
}

export class SearchiveClient {
    createIndexer(): Promise<SearchiveSearchIndexer> {
        return new Promise(resolve => {
            lunr(function(this: any) {
                resolve(this as SearchiveSearchIndexer);
            });
        });
    }
}
