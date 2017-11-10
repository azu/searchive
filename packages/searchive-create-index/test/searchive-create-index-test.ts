// MIT © 2017 azu
import * as path from "path";
import * as assert from "assert";
import { createIndex, readAllAsJSON } from "../src/searchive-create-index";

describe("searchive-create-index", () => {
    it("can create index", async () => {
        const results = await readAllAsJSON([path.join(__dirname, "fixtures/pdf/*.pdf")]);
        assert.ok(results.length > 0);
        const index = await createIndex(results);
        assert.equal(typeof index, "object");
    });
});
