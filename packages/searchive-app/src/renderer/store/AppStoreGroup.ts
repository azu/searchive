// MIT © 2017 azu

import { StoreGroup } from "almin";
import { SearchIndexStore } from "./SearchIndexStore/SearchIndexStore";
import { SearchStore } from "./Search/SearchStore";

export const appStoreGroup = new StoreGroup({
    search: new SearchStore(),
    index: new SearchIndexStore()
});
