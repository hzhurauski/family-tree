import { CopyAudios } from './CopyAudios.js'
import { RefreshAudios } from './RefreshAudios.js'
import { UpdateAudios } from './UpdateAudios.js'

export function PasteAudios() {
  g_copyObject = JSON.parse(sessionStorage.getItem(CopyObjectSessionStorageKey))

  if (g_copyObject == null || g_copyObject.Ids.length == 0) return

  if (
    g_copyObject.CopyObjectType == null ||
    g_copyObject.CopyObjectType != CopyObjectTypes.Audio
  ) {
    alert('Ошибка при вставке из буфера (неверный тип объектов)')
    return
  }

  CopyAudios(g_copyObject.Ids, g_currentDataBlock.Id).then(
    (data) => {
      RefreshAudios().then((val) => UpdateAudios())
    },
    (r) => {
      alert('Ошибка при вставке из буфера')
    }
  )
}
