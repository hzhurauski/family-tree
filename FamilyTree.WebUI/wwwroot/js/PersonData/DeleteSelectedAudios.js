import { GetSelectedAudiosIds } from "./GetSelectedAudiosIds.js";

export async function DeleteSelectedAudios() {
    let audiosIds = GetSelectedAudiosIds();

    if (audiosIds.length == 0)
        return;

    const promises = audiosIds.map(window.DeleteAudio);

    await Promise.all(promises);
}