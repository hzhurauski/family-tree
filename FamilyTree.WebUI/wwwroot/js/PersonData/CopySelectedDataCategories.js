import { GetSelectedDataCategoriesIds } from "./GetSelectedDataCategoriesIds.js";

export function CopySelectedDataCategories() {
    window.g_copyObject.Ids = GetSelectedDataCategoriesIds();
    window.g_copyObject.CopyObjectType = window.CopyObjectTypes.DataCategory;
    sessionStorage.setItem(window.CopyObjectSessionStorageKey, JSON.stringify(window.g_copyObject));
}