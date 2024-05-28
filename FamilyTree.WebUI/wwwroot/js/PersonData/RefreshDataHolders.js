import { RefreshDataCategory } from './RefreshDataCategory.js'

export function RefreshDataHolders() {
  RefreshDataCategory()
  window.g_currentDataBlock = window.g_currentDataCategory.DataBlocks.find(
    (item) => item.Id == window.g_currentDataBlock.Id
  )
}
