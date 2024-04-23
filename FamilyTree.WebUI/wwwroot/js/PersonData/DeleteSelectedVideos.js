import { GetSelectedVideosIds } from "./GetSelectedVideosIds.js";

export async function DeleteSelectedVideos() {
    let videosIds = GetSelectedVideosIds();

    if (videosIds.length == 0)
        return;
    
    const promises = videosIds.map(window.DeleteVideo);

    await Promise.all(promises);
}
