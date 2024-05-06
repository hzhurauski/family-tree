import { GetDataCategories } from './GetDataCategories.js'

/**
 * Перезаписывает глобальную переменную `g_dataCategories` новыми категориями.
 */
export function RefreshDataCategories() {
  g_dataCategories = GetDataCategories(g_currentPerson.Id)
}
