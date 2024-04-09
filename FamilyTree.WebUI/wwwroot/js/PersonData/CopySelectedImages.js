import { GetSelectedImagesIds } from "./GetSelectedImagesIds.js";

export function CopySelectedImages() {
    g_copyObject.Ids = GetSelectedImagesIds();
    g_copyObject.CopyObjectType = CopyObjectTypes.Image;
    sessionStorage.setItem(CopyObjectSessionStorageKey, JSON.stringify(g_copyObject));
}