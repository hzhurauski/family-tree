import { DeleteDataHolder } from './DeleteDataHolder.js'
import { GetSelectedDataHoldersIds } from './GetSelectedDataHoldersIds.js'

export async function DeleteSelectedDataHolders() {
  let dataHoldersIds = GetSelectedDataHoldersIds()

  if (dataHoldersIds.length == 0) return

  for (let i = 0; i < dataHoldersIds.length; i++) {
    await DeleteDataHolder(dataHoldersIds[i])
  }
}
