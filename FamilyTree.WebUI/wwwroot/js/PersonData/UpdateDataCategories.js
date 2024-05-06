import { AddItemToDataCategories } from './AddItemToDataCategories.js'
import { ClearDataCategories } from './ClearDataCategories.js'
import { OnDataCategoryClick } from './OnDataCategoryClick.js'
import { UpdateDataCategoryOrder } from './UpdateDataCategoryOrder.js'

/**
 * Обновляет данные категорий человека из глобальной
 * переменной `g_dataCategories`.
 */
export function UpdateDataCategories() {
  ClearDataCategories()

  g_dataCategories.forEach(item => {
    AddItemToDataCategories(item)
  })

  new Sortable($('.person-data-block__data-categories')[0], {
    handle: '.data-categories__item',
    animation: 500,
    onEnd: event => {
      let dataCategory = {
        Id: $(event.item).attr('data-id'),
        Order: event.newIndex + 1,
      }

      UpdateDataCategoryOrder(dataCategory)
    },
  })

  $('#person-data-block')
    .find('.data-categories')
    .find('.data-categories__item')
    .click(OnDataCategoryClick)
}
