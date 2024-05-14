import { RefreshDataHolders } from './RefreshDataHolders.js'
import { UpdateDataHolderTitle } from './UpdateDataHolderTitle.js'
import { UpdateDataHolders } from './UpdateDataHolders.js'

export function OnEditDataHolderSubmitButtonClick() {
  let dataHolder = {
    Id: window.g_editElementId,
    Title: $('#edit-data-holder-title').val(),
    //,isShown: $("edit-data-holder-order").val()
  }

  if (!UpdateDataHolderTitle(dataHolder)) {
    alert('Ошибка при изменении параметров ячейки.')
  } else {
    $('#edit-data-holder-modal').modal('hide')
    RefreshDataHolders()
    UpdateDataHolders()
  }
}
