// MIT © 2017 azu
const lunr = require("elasticlunr");
// set english and japanese
require("lunr-languages/lunr.stemmer.support.js")(lunr);
require("lunr-language-jp")(lunr);
require("lunr-languages/lunr.multi.js")(lunr);
lunr.multiLanguage("en", "jp");

export interface SearchiveSearchIndexer {
    use;
    setRef;

    addField(field: string);

    addDoc(): void;
}

export class SearchiveClient {
    addIndex(indexer) {}
}
