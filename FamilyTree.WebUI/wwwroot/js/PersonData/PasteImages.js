import { CopyImages } from './CopyImages.js'
import { RefreshImages } from './RefreshImages.js'
import { UpdateImages } from './UpdateImages.js'

export function PasteImages() {
  window.g_copyObject = JSON.parse(
    sessionStorage.getItem(window.CopyObjectSessionStorageKey)
  )

  if (window.g_copyObject == null || window.g_copyObject.Ids.length == 0) return

  if (
    window.g_copyObject.CopyObjectType == null ||
    window.g_copyObject.CopyObjectType != window.CopyObjectTypes.Image
  ) {
    alert('Ошибка при вставке из буфера (неверный тип объектов)')
    return
  }

  CopyImages(window.g_copyObject.Ids, window.g_currentDataBlock.Id).then(
    (data) => {
      RefreshImages().then((val) => UpdateImages())
    },
    (r) => {
      alert('Ошибка при вставке из буфера')
    }
  )
}
