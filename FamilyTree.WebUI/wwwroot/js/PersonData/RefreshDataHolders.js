import { RefreshDataCategory } from './RefreshDataCategory.js'

export function RefreshDataHolders() {
  RefreshDataCategory()
  g_currentDataBlock = g_currentDataCategory.DataBlocks.find(
    (item) => item.Id == g_currentDataBlock.Id
  )
}
