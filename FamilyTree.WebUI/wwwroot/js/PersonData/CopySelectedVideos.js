import { GetSelectedVideosIds } from "./GetSelectedVideosIds.js";

export function CopySelectedVideos() {
    window.g_copyObject.Ids = GetSelectedVideosIds();
    window.g_copyObject.CopyObjectType = window.CopyObjectTypes.Video;
    sessionStorage.setItem(window.CopyObjectSessionStorageKey, JSON.stringify(window.g_copyObject));
}