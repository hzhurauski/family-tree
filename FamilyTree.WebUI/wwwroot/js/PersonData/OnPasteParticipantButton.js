import { GetSelectedDataBlocksIds } from "./GetSelectedDataBlocksIds.js";

export function OnPasteParticipantButton() {
    window.g_currentDataBlockIdsToAssignParticipant = GetSelectedDataBlocksIds();
}
