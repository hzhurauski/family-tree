import { GetSelectedDataHoldersIds } from './GetSelectedDataHoldersIds.js'

export function CopySelectedDataHolders() {
  g_copyObject.Ids = GetSelectedDataHoldersIds()
  g_copyObject.CopyObjectType = CopyObjectTypes.DataHolder
  sessionStorage.setItem(
    CopyObjectSessionStorageKey,
    JSON.stringify(g_copyObject)
  )
}
