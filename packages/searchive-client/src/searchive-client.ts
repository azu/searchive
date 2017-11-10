// MIT © 2017 azu
import { createSearchSet, SearchOperator } from "./search-word-timer";

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

export class SearchiveIndexer {
    private lunrInstance: any;

    get ready(): Promise<this> {
        return new Promise(resolve => {
            const that = this;
            lunr(function(this: any) {
                that.lunrInstance = this;
                // Apply lang
                that.lunrInstance.use(lunr.multiLanguage("en", "jp"));
                // ready ok
                resolve(this);
            });
        });
    }

    use(...plugins: any[]): void {
        this.lunrInstance.use(...plugins);
    }

    setRef(ref: string): void {
        this.lunrInstance.setRef(ref);
    }

    addField(field: string): void {
        this.lunrInstance.addField(field);
    }

    addDoc(doc: SearchiveDocument): void {
        this.lunrInstance.addDoc(doc);
    }

    toJSON(): Object {
        return this.lunrInstance.toJSON();
    }
}

export class SearchiveSearcher {
    private idx: any;

    constructor(database: Object) {
        this.idx = lunr.Index.load(database);
    }

    search(text: string, operator: SearchOperator = "OR"): { ref: string; score: number }[] {
        return this.idx.search(text, {
            bool: operator
        });
    }

    searchText(text: string): { ref: string; score: number }[] {
        const set = createSearchSet(text);
        return this.search(set.text, set.operator);
    }

    getDoc(ref: string): SearchiveDocument | undefined {
        return this.idx.documentStore.getDoc(ref);
    }
}
