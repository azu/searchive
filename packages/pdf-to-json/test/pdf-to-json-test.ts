// MIT © 2017 azu
import * as path from "path";
import * as assert from "assert";
import { pdfToJSON } from "../src/pdf-to-json";

describe("pdf-to-json", () => {
    it("should return array", async () => {
        const fixture = path.join(__dirname, "./fixtures/javascript-promise-book.pdf");
        const { meta, pages } = await pdfToJSON(fixture);
        assert.ok(Array.isArray(pages));
        assert.ok(typeof meta === "object");
        pages.forEach(page => {
            console.log(page.texts);
            assert.ok(page.pageNumber > 0);
            assert.ok(Array.isArray(page.texts));
        });
    });
});
