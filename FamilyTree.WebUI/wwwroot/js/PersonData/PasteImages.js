import { CopyImages } from './CopyImages.js'
import { RefreshImages } from './RefreshImages.js'
import { UpdateImages } from './UpdateImages.js'

export function PasteImages() {
  g_copyObject = JSON.parse(sessionStorage.getItem(CopyObjectSessionStorageKey))

  if (g_copyObject == null || g_copyObject.Ids.length == 0) return

  if (
    g_copyObject.CopyObjectType == null ||
    g_copyObject.CopyObjectType != CopyObjectTypes.Image
  ) {
    alert('Ошибка при вставке из буфера (неверный тип объектов)')
    return
  }

  CopyImages(g_copyObject.Ids, g_currentDataBlock.Id).then(
    (data) => {
      RefreshImages().then((val) => UpdateImages())
    },
    (r) => {
      alert('Ошибка при вставке из буфера')
    }
  )
}
