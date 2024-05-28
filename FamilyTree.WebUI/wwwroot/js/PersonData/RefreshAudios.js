import { GetAudios } from './GetAudios.js'

export async function RefreshAudios() {
  window.g_currentDataBlockAudios = await GetAudios(window.g_currentDataBlock.Id)
}
