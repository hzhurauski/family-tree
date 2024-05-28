export function OnEditElementButtonClick() {
  switch (window.g_currentAddButtonActionType) {
    case window.AddButtonActionTypes.AddDataBlock: {
      let selectedDataBlocks = $('#person-data-block')
        .find('.data-blocks')
        .find('.data-blocks__item input[type="checkbox"]:checked')
        .parents('.data-blocks__item')

      if (selectedDataBlocks.length == 0 || selectedDataBlocks.length > 1)
        return

      window.g_editElementId = selectedDataBlocks.attr('data-id')
      $('#edit-data-block-title').val(
        selectedDataBlocks.first().find('.data-block__value')[0].innerHTML
      )

      $('#edit-data-block-modal').modal('show')
      break
    }
    case window.AddButtonActionTypes.AddDataHolder: {
      let selectedDataHolders = $('#person-data-block')
        .find('.data-holders')
        .find('.data-holders__item input[type="checkbox"]:checked')
        .parents('.data-holders__item')

      if (selectedDataHolders.length == 0 || selectedDataHolders.length > 1)
        return

      window.g_editElementId = selectedDataHolders.attr('data-id')

      let titleEl = selectedDataHolders
        .first()
        .find('.data-holder__title div')[0]

      if (titleEl == null)
        titleEl = selectedDataHolders
          .first()
          .find('.data-holder-gender__title div')[0]

      if (titleEl == null)
        titleEl = selectedDataHolders
          .first()
          .find('.data-holder-textarea__title div')[0]

      $('#edit-data-holder-title').val(titleEl.innerHTML)

      $('#edit-data-holder-modal').modal('show')
      break
    }

    default:
      break
  }
}
