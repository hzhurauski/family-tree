import { GetSelectedAudiosIds } from "./GetSelectedAudiosIds.js";

export function CopySelectedAudios() {
    window.g_copyObject.Ids = GetSelectedAudiosIds();
    window.g_copyObject.CopyObjectType = window.CopyObjectTypes.Audio;
    sessionStorage.setItem(window.CopyObjectSessionStorageKey, JSON.stringify(window.g_copyObject));
}