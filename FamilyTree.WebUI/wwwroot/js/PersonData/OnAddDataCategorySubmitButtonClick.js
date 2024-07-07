import { CreateDataCategory } from './CreateDataCategory.js'
import { RefreshDataCategories } from './RefreshDataCategories.js'
import { UpdateDataCategories } from './UpdateDataCategories.js'

export function OnAddDataCategorySubmitButtonClick() {
  let dataCategory = {
    DataCategoryType: $('#add-data-category-type').val(),
    Name: $('#add-data-category-name').val(),
    PersonId: window.g_currentPerson.Id,
  }

  if (CreateDataCategory(dataCategory) === -1) {
    alert('Ошибка при создании категории данных.')
  } else {
    $('#add-data-category-modal').modal('hide')
    RefreshDataCategories()
    UpdateDataCategories()
  }
}
