import { GetVideos } from "./GetVideos.js";

export async function RefreshVideos() {
    g_currentDataBlockVideos = await GetVideos(g_currentDataBlock.Id);
}