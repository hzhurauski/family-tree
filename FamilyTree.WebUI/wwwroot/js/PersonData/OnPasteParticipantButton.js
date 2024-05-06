import { GetSelectedDataBlocksIds } from './GetSelectedDataBlocksIds.js'

export function OnPasteParticipantButton() {
  g_currentDataBlockIdsToAssignParticipant = GetSelectedDataBlocksIds()
}
