import { GetImages } from './GetImages.js'

export async function RefreshImages() {
  window.g_currentDataBlockImages = await GetImages(window.g_currentDataBlock.Id)
}
