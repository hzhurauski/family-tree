import { CopyDataCategories } from './CopyDataCategories.js'
import { RefreshDataCategories } from './RefreshDataCategories.js'
import { UpdateDataCategories } from './UpdateDataCategories.js'

export function PasteDataCategories() {
  g_copyObject = JSON.parse(sessionStorage.getItem(CopyObjectSessionStorageKey))

  if (g_copyObject == null || g_copyObject.Ids.length == 0) return

  if (
    g_copyObject.CopyObjectType == null ||
    g_copyObject.CopyObjectType != CopyObjectTypes.DataCategory
  ) {
    alert('Ошибка при вставке из буфера (неверный тип объектов)')
    return
  }

  if (!CopyDataCategories(g_copyObject.Ids, g_currentPerson.Id)) {
    alert('Ошибка при вставке из буфера')
    return
  }

  RefreshDataCategories()
  UpdateDataCategories()
}
