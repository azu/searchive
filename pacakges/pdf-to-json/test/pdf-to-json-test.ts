// MIT © 2017 azu
import * as path from "path";
import * as assert from "assert";
import { pdfToJSON } from "../src/pdf-to-json";

describe("pdf-to-json", () => {
    it("should return array", async () => {
        const fixture = path.join(__dirname, "./fixtures/javascript-promise-book.pdf");
        const results = await pdfToJSON(fixture);
        assert.ok(Array.isArray(results));
        results.forEach(result => {
            assert.ok(result.pageNumber > 0);
            assert.ok(Array.isArray(results));
        });
    });
});
