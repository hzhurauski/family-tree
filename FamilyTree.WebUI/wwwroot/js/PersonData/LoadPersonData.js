import { GetPersonData } from './GetPersonData.js'
import { RefreshDataCategories } from './RefreshDataCategories.js'
import { UpdateDataCategories } from './UpdateDataCategories.js'

/**
 * Возвращает результат загрузки данных человека.
 *
 * @async
 * @function
 * @param {number} personId ID человека в дереве (data-id аттрибут)
 * @returns {Promise<boolean>}
 */
export async function LoadPersonData(personId) {
  // Если произошла ошибка, то устанавливает текущего человека как null
  window.g_currentPerson = await GetPersonData(personId).catch(r => {
    window.g_currentPerson = null
  })

  // Если не удалось получить человека по Id, возвращает false
  if (window.g_currentPerson == null) return false

  // Обновляем глобальную переменную g_dataCategories
  RefreshDataCategories()

  // Если категорий нет, значит что-то пошло не так
  if (window.g_dataCategories.length === 0) return false

  // Обновляем категории
  UpdateDataCategories()

  $('#person-data-block')
    .find('.data-categories')
    .find('.data-categories__item')[0]
    .click()

  return true
}
