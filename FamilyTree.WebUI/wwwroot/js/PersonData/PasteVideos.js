import { CopyVideos } from './CopyVideos.js'
import { RefreshVideos } from './RefreshVideos.js'
import { UpdateVideos } from './UpdateVideos.js'

export function PasteVideos() {
  window.g_copyObject = JSON.parse(
    sessionStorage.getItem(window.CopyObjectSessionStorageKey)
  )

  if (window.g_copyObject == null || window.g_copyObject.Ids.length == 0) return

  if (
    window.g_copyObject.CopyObjectType == null ||
    window.g_copyObject.CopyObjectType != window.CopyObjectTypes.Video
  ) {
    alert('Ошибка при вставке из буфера (неверный тип объектов)')
    return
  }

  CopyVideos(window.g_copyObject.Ids, window.g_currentDataBlock.Id).then(
    (data) => {
      RefreshVideos().then((val) => UpdateVideos())
    },
    (r) => {
      alert('Ошибка при вставке из буфера')
    }
  )
}
