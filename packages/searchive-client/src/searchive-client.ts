// MIT © 2017 azu
import { SearchQueryTester } from "search-query-tester";

export interface SearchiveDocumentIndex {
    indexPatterns: string[];
    documents: SearchiveDocument[];
}

export interface SearchiveDocument {
    id: string;
    title?: string;
    author?: string;
    body: string;
    filePath: string;
    pageNumber: number;
}

export class SearchiveIndexer {
    private index: SearchiveDocumentIndex | undefined;
    private documents: SearchiveDocument[];

    constructor(database?: SearchiveDocumentIndex) {
        this.index = database;
        this.documents = this.index ? this.index.documents : [];
    }

    get ready(): Promise<this> {
        return new Promise(resolve => {
            resolve(this);
        });
    }

    addDoc(doc: SearchiveDocument): void {
        this.documents.push(doc);
    }

    toIndex(indexPatterns: string[]): SearchiveDocumentIndex {
        return {
            indexPatterns,
            documents: this.documents
        };
    }
}

export class SearchiveSearcher {
    private documents: SearchiveDocument[];

    constructor(documents: SearchiveDocument[]) {
        this.documents = documents;
    }

    get ready(): Promise<this> {
        return new Promise(resolve => {
            resolve(this);
        });
    }

    search(text: string): SearchiveDocument[] {
        const tester = new SearchQueryTester();
        return this.documents.filter(doc => {
            return tester.test(text, doc);
        });
    }
}
