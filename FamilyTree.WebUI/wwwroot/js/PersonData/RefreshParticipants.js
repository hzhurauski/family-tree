import { GetParticipants } from './GetParticipants.js'

export async function RefreshParticipants() {
  window.g_currentDataBlockParticipants = await GetParticipants(
    window.g_currentDataBlock.Id
  )
}
