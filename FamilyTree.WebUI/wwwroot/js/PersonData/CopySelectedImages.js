import { GetSelectedImagesIds } from './GetSelectedImagesIds.js'

export function CopySelectedImages() {
  window.g_copyObject.Ids = GetSelectedImagesIds()
  window.g_copyObject.CopyObjectType = window.CopyObjectTypes.Image
  sessionStorage.setItem(
    CopyObjectSessionStorageKey,
    JSON.stringify(window.g_copyObject)
  )
}
