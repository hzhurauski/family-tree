import { GetParticipants } from "./GetParticipants.js";

export async function RefreshParticipants() {
    g_currentDataBlockParticipants = await GetParticipants(g_currentDataBlock.Id);
}