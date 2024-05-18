import { CopyDataBlocks } from "./CopyDataBlocks.js";
import { RefreshDataBlocks } from "./RefreshDataBlocks.js";
import { UpdateDataBlocks } from "./UpdateDataBlocks.js";

export function PasteDataBlocks() {
    window.g_copyObject = JSON.parse(sessionStorage.getItem(window.CopyObjectSessionStorageKey));

    if (window.g_copyObject == null ||
        window.g_copyObject.Ids.length == 0)
        return;

    if (window.g_copyObject.CopyObjectType == null ||
        window.g_copyObject.CopyObjectType != window.CopyObjectTypes.DataBlock) {
        alert("Ошибка при вставке из буфера (неверный тип объектов)");
        return;
    }

    if (!CopyDataBlocks(window.g_copyObject.Ids, window.g_currentDataCategory.Id)) {
        alert("Ошибка при вставке из буфера");
        return;
    }

    RefreshDataBlocks();
    UpdateDataBlocks();
}