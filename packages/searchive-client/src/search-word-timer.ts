// MIT © 2017 azu
export type SearchOperator = "OR" | "AND";

export const createSearchSet = (
    text: string
): {
    text: string;
    operator: SearchOperator;
} => {
    const hasAND = /\s+AND\s/.test(text);
    const hasOR = /\s+OR\s/.test(text);
    if (hasAND) {
        return {
            text: text.replace(/ AND /g, " "),
            operator: "AND"
        };
    } else if (hasOR) {
        return {
            text: text.replace(/ OR /g, " "),
            operator: "OR"
        };
    } else {
        return {
            text: text,
            operator: "OR"
        };
    }
};
