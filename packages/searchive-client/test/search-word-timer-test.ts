// MIT © 2017 azu
import * as assert from "assert";
import { createSearchSet } from "../src/search-word-timer";

describe("createSearchSet", () => {
    it("should return AND when include AND in text", () => {
        const result = createSearchSet("A AND B");
        assert.equal(result.text, "A B");
        assert.equal(result.operator, "AND");
    });
    it("should return OR when include OR in text", () => {
        const result = createSearchSet("A OR B");
        assert.equal(result.text, "A B");
        assert.equal(result.operator, "OR");
    });
    it("should return OR when not include AND, OR in text", () => {
        const result = createSearchSet("A B");
        assert.equal(result.text, "A B");
        assert.equal(result.operator, "OR");
    });
});
