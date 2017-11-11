// MIT © 2017 azu
import * as path from "path";
import * as assert from "assert";
import { createIndex } from "../src/searchive-create-index";

describe("searchive-create-index", () => {
    it("can create index", async () => {
        const index = await createIndex([path.join(__dirname, "fixtures/pdf/*.pdf")]);
        assert.equal(typeof index, "object");
    });
});
