import { GetSelectedVideosIds } from "./GetSelectedVideosIds.js";

export function CopySelectedVideos() {
    g_copyObject.Ids = GetSelectedVideosIds();
    g_copyObject.CopyObjectType = CopyObjectTypes.Video;
    sessionStorage.setItem(CopyObjectSessionStorageKey, JSON.stringify(g_copyObject));
}