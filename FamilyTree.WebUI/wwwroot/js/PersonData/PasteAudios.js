import { CopyAudios } from './CopyAudios.js'
import { RefreshAudios } from './RefreshAudios.js'
import { UpdateAudios } from './UpdateAudios.js'

export function PasteAudios() {
  window.g_copyObject = JSON.parse(
    sessionStorage.getItem(window.CopyObjectSessionStorageKey)
  )

  if (window.g_copyObject == null || window.g_copyObject.Ids.length == 0) return

  if (
    window.g_copyObject.CopyObjectType == null ||
    window.g_copyObject.CopyObjectType != window.CopyObjectTypes.Audio
  ) {
    alert('Ошибка при вставке из буфера (неверный тип объектов)')
    return
  }

  CopyAudios(window.g_copyObject.Ids, window.g_currentDataBlock.Id).then(
    (data) => {
      RefreshAudios().then((val) => UpdateAudios())
    },
    (r) => {
      alert('Ошибка при вставке из буфера')
    }
  )
}
