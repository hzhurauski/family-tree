import { DeleteSelectedDataCategories } from './DeleteSelectedDataCategories.js'
import { RefreshDataCategories } from './RefreshDataCategories.js'
import { UpdateDataCategories } from './UpdateDataCategories.js'

export function OnDeleteDataCategorySubmitButtonClick() {
  DeleteSelectedDataCategories().then((val) => {
    RefreshDataCategories()
    UpdateDataCategories()
    $('#delete-data-category-modal').modal('hide')
  })
}
