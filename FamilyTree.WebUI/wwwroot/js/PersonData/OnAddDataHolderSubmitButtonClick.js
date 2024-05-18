import { CreateDataHolder } from './CreateDataHolder.js'
import { RefreshDataHolders } from './RefreshDataHolders.js'
import { UpdateDataHolders } from './UpdateDataHolders.js'

export function OnAddDataHolderSubmitButtonClick() {
  let dataHolder = {
    DataHolderType: $('#add-data-holder-type').val(),
    Title: $('#add-data-holder-title').val(),
    Data: '',
    DataBlockId: window.g_currentDataBlock.Id,
  }

  if (CreateDataHolder(dataHolder) === -1) {
    alert('Ошибка при создании ячейки данных.')
  } else {
    $('#add-data-holder-modal').modal('hide')
    RefreshDataHolders()
    UpdateDataHolders()
  }
}
