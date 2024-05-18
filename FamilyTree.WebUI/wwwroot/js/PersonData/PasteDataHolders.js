import { CopyDataHolders } from "./CopyDataHolders.js";
import { RefreshDataHolders } from "./RefreshDataHolders.js";
import { UpdateDataHolders } from "./UpdateDataHolders.js";

export function PasteDataHolders() {
    window.g_copyObject = JSON.parse(sessionStorage.getItem(window.CopyObjectSessionStorageKey));

    if (window.g_copyObject == null ||
        window.g_copyObject.Ids.length == 0)
        return;

    if (window.g_copyObject.CopyObjectType == null ||
        window.g_copyObject.CopyObjectType != window.CopyObjectTypes.DataHolder) {
        alert("Ошибка при вставке из буфера (неверный тип объектов)");
        return;
    }

    if (!CopyDataHolders(window.g_copyObject.Ids, window.g_currentDataBlock.Id)) {
        alert("Ошибка при вставке из буфера");
        return;
    }

    RefreshDataHolders();
    UpdateDataHolders();
}