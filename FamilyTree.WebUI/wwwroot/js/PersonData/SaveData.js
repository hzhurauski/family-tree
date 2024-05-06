import { ReloadTree } from '../LoadTree/LoadTree.js'
import { GetDataCategory } from './GetDataCategory.js'
import { SaveDataHolders } from './SaveDataHolders.js'

export async function SaveData() {
  let saveButton = $('#save-elements-button')
  saveButton.find('.loader').css('display', 'block')
  saveButton.find('.btn__text')[0].innerHTML = 'Сохранение'

  await SaveDataHolders().then(
    async data => {
      g_currentDataCategory = GetDataCategory(g_currentDataCategory.Id)

      if (
        g_currentDataCategory.DataCategoryType == DataCategoryTypes.PersonInfo
      )
        ReloadTree($('#mainPerson')[0].getAttribute('data-value'))

      saveButton.find('.loader').css('display', 'none')
      saveButton.find('.btn__text')[0].innerHTML = 'Сохранено'
      saveButton.removeClass('btn-default')
      saveButton.addClass('btn-success')
      await window.WaitForMilliseconds(1500)
    },
    r => {
      alert('Произошла ошибка во время сохранения.')
    }
  )

  saveButton.find('.btn__text')[0].innerHTML = 'Сохранить'
  saveButton.removeClass('btn-success')
  saveButton.addClass('btn-default')

  g_isSaving = false
}
