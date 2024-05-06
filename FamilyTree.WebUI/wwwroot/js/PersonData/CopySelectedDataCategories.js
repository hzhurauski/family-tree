import { GetSelectedDataCategoriesIds } from './GetSelectedDataCategoriesIds.js'

export function CopySelectedDataCategories() {
  g_copyObject.Ids = GetSelectedDataCategoriesIds()
  g_copyObject.CopyObjectType = CopyObjectTypes.DataCategory
  sessionStorage.setItem(
    CopyObjectSessionStorageKey,
    JSON.stringify(g_copyObject)
  )
}
