// MIT © 2017 azu
import * as assert from "assert";
import { SearchiveSearcher } from "../src/searchive-client";

describe("searchive-client", () => {
    describe("SearchiveSearcher", () => {
        it("can search text from index", () => {
            const index = require("./fixtures/index.json");
            const searcher = new SearchiveSearcher(index);
            const results = searcher.search("test");
            assert.ok(results.length > 0);
        });
    });
});
