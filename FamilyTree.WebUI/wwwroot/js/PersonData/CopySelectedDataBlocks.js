import { GetSelectedDataBlocksIds } from './GetSelectedDataBlocksIds.js'

export function CopySelectedDataBlocks() {
  window.g_copyObject.Ids = GetSelectedDataBlocksIds()
  window.g_copyObject.CopyObjectType = window.CopyObjectTypes.DataBlock
  sessionStorage.setItem(
    window.CopyObjectSessionStorageKey,
    JSON.stringify(window.g_copyObject)
  )
}
