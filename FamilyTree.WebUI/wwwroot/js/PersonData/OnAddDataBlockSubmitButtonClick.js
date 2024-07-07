import { CreateDataBlock } from './CreateDataBlock.js'
import { RefreshDataBlocks } from './RefreshDataBlocks.js'
import { UpdateDataBlocks } from './UpdateDataBlocks.js'

export function OnAddDataBlockSubmitButtonClick() {
  let dataBlock = {
    Title: $('#add-data-block-title').val(),
    DataCategoryId: window.g_currentDataCategory.Id,
  }

  if (CreateDataBlock(dataBlock) === -1) {
    alert('Ошибка при создании блока данных.')
  } else {
    $('#add-data-block-modal').modal('hide')
    RefreshDataBlocks()
    UpdateDataBlocks()
  }
}
