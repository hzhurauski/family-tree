import { GetAudios } from "./GetAudios.js";

export async function RefreshAudios() {
    g_currentDataBlockAudios = await GetAudios(g_currentDataBlock.Id);
}