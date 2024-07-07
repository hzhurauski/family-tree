import { CopyDataCategories } from './CopyDataCategories.js'
import { RefreshDataCategories } from './RefreshDataCategories.js'
import { UpdateDataCategories } from './UpdateDataCategories.js'

export function PasteDataCategories() {
  window.g_copyObject = JSON.parse(
    sessionStorage.getItem(window.CopyObjectSessionStorageKey)
  )

  if (window.g_copyObject == null || window.g_copyObject.Ids.length == 0) return

  if (
    window.g_copyObject.CopyObjectType == null ||
    window.g_copyObject.CopyObjectType != window.CopyObjectTypes.DataCategory
  ) {
    alert('Ошибка при вставке из буфера (неверный тип объектов)')
    return
  }

  if (!CopyDataCategories(window.g_copyObject.Ids, window.g_currentPerson.Id)) {
    alert('Ошибка при вставке из буфера')
    return
  }

  RefreshDataCategories()
  UpdateDataCategories()
}
