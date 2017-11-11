// MIT © 2017 azu

import { StoreGroup } from "almin";
import { SearchIndexStore } from "./SearchIndexStore/SearchIndexStore";

export const appStoreGroup = new StoreGroup({
    index: new SearchIndexStore()
});
