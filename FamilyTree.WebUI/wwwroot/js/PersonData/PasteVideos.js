import { CopyVideos } from './CopyVideos.js'
import { RefreshVideos } from './RefreshVideos.js'
import { UpdateVideos } from './UpdateVideos.js'

export function PasteVideos() {
  g_copyObject = JSON.parse(
    sessionStorage.getItem(window.CopyObjectSessionStorageKey)
  )

  if (g_copyObject == null || g_copyObject.Ids.length == 0) return

  if (
    g_copyObject.CopyObjectType == null ||
    g_copyObject.CopyObjectType != CopyObjectTypes.Video
  ) {
    alert('Ошибка при вставке из буфера (неверный тип объектов)')
    return
  }

  CopyVideos(g_copyObject.Ids, g_currentDataBlock.Id).then(
    (data) => {
      RefreshVideos().then((val) => UpdateVideos())
    },
    (r) => {
      alert('Ошибка при вставке из буфера')
    }
  )
}
