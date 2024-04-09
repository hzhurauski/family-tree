import { CopyDataBlocks } from "./CopyDataBlocks.js";
import { RefreshDataBlocks } from "./RefreshDataBlocks.js";
import { UpdateDataBlocks } from "./UpdateDataBlocks.js";

export function PasteDataBlocks() {
    g_copyObject = JSON.parse(sessionStorage.getItem(CopyObjectSessionStorageKey));

    if (g_copyObject == null ||
        g_copyObject.Ids.length == 0)
        return;

    if (g_copyObject.CopyObjectType == null ||
        g_copyObject.CopyObjectType != CopyObjectTypes.DataBlock) {
        alert("Ошибка при вставке из буфера (неверный тип объектов)");
        return;
    }

    if (!CopyDataBlocks(g_copyObject.Ids, g_currentDataCategory.Id)) {
        alert("Ошибка при вставке из буфера");
        return;
    }

    RefreshDataBlocks();
    UpdateDataBlocks();
}