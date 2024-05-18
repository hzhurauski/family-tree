import { GetSelectedDataHoldersIds } from "./GetSelectedDataHoldersIds.js";

export function CopySelectedDataHolders() {
    window.g_copyObject.Ids = GetSelectedDataHoldersIds();
    window.g_copyObject.CopyObjectType = window.CopyObjectTypes.DataHolder;
    sessionStorage.setItem(window.CopyObjectSessionStorageKey, JSON.stringify(window.g_copyObject));
}