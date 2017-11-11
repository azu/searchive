// MIT © 2017 azu
import { SearchQueryTester } from "search-query-tester";

export interface SearchiveDocument {
    id: string;
    title?: string;
    author?: string;
    body: string;
    filePath: string;
    pageNumber: number;
}

export class SearchiveIndexer {
    private index: SearchiveDocument[] = [];

    get ready(): Promise<this> {
        return new Promise(resolve => {
            resolve(this);
        });
    }

    addDoc(doc: SearchiveDocument): void {
        this.index.push(doc);
    }

    toJSON(): Object {
        return this.index;
    }
}

export class SearchiveSearcher {
    private index: SearchiveDocument[];

    constructor(database: Object) {
        this.index = database as SearchiveDocument[];
    }

    search(text: string): SearchiveDocument[] {
        const tester = new SearchQueryTester();
        return this.index.filter(doc => {
            return tester.test(text, doc);
        });
    }
}
