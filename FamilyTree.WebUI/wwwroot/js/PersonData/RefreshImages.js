import { GetImages } from "./GetImages.js";

export async  function RefreshImages() {
    g_currentDataBlockImages = await GetImages(g_currentDataBlock.Id);
}