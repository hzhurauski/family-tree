import { GetVideos } from './GetVideos.js'

export async function RefreshVideos() {
  window.g_currentDataBlockVideos = await GetVideos(
    window.g_currentDataBlock.Id
  )
}
