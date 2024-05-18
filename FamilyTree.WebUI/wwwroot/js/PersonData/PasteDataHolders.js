import { CopyDataHolders } from './CopyDataHolders.js'
import { RefreshDataHolders } from './RefreshDataHolders.js'
import { UpdateDataHolders } from './UpdateDataHolders.js'

export function PasteDataHolders() {
  g_copyObject = JSON.parse(sessionStorage.getItem(CopyObjectSessionStorageKey))

  if (g_copyObject == null || g_copyObject.Ids.length == 0) return

  if (
    g_copyObject.CopyObjectType == null ||
    g_copyObject.CopyObjectType != CopyObjectTypes.DataHolder
  ) {
    alert('Ошибка при вставке из буфера (неверный тип объектов)')
    return
  }

  if (!CopyDataHolders(g_copyObject.Ids, g_currentDataBlock.Id)) {
    alert('Ошибка при вставке из буфера')
    return
  }

  RefreshDataHolders()
  UpdateDataHolders()
}
