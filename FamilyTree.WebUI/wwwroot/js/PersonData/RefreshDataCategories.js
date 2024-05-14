import { GetDataCategories } from './GetDataCategories.js'

export function RefreshDataCategories() {
  g_dataCategories = GetDataCategories(g_currentPerson.Id)
}
