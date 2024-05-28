import { GetDataCategory } from './GetDataCategory.js'

export function RefreshDataCategory() {
  window.g_currentDataCategory = GetDataCategory(
    window.g_currentDataCategory.Id
  )
}
