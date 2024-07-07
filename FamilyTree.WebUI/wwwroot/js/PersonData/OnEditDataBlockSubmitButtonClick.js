import { RefreshDataBlocks } from './RefreshDataBlocks.js'
import { UpdateDataBlockTitle } from './UpdateDataBlockTitle.js'
import { UpdateDataBlocks } from './UpdateDataBlocks.js'

export function OnEditDataBlockSubmitButtonClick() {
  let dataBlock = {
    Id: window.g_editElementId,
    Title: $('#edit-data-block-title').val(),
  }

  if (!UpdateDataBlockTitle(dataBlock)) {
    alert('Ошибка при изменении заголовка блока для данных.')
  } else {
    $('#edit-data-block-modal').modal('hide')
    RefreshDataBlocks()
    UpdateDataBlocks()
  }
}
