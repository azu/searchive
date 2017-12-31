// MIT © 2017 azu
import * as path from "path";
import * as assert from "assert";
import { createIndex } from "../src";
import { SearchiveDocument } from "searchive-client";

describe("searchive-create-index", () => {
    it("can observe progressing", async () => {
        const indexingPromise = createIndex([
            path.join(__dirname, "fixtures/pdf/alice-in-wonderland-book.pdf"),
            path.join(__dirname, "fixtures/pdf/javascript-promise-book.pdf")
        ]);
        const progressValues: number[] = [];
        indexingPromise.onProgress(progress => {
            assert(typeof progress === "number" && progress >= 0);
            progressValues.push(progress);
        });
        const index = await indexingPromise;
        assert.deepEqual(progressValues, [0.5, 1]);
        assert.ok(Array.isArray(index.indexPatterns));
        (index.indexPatterns as string[]).forEach(pattern => {
            assert.equal(typeof pattern, "string");
        });
        assert.ok(Array.isArray(index.documents));
        (index.documents as SearchiveDocument[]).forEach(document => {
            assert.equal(typeof document.id, "string");
        });
    });
});
