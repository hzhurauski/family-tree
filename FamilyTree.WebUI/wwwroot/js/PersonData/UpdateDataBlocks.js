import { AddItemToDataBlocks } from './AddItemToDataBlocks.js'
import { ClearDataBlocks } from './ClearDataBlocks.js'
import { OnDataBlockClick } from './OnDataBlockClick.js'
import { UpdateDataBlockOrder } from './UpdateDataBlockOrder.js'

export function UpdateDataBlocks() {
  ClearDataBlocks()

  g_currentDataCategory.DataBlocks.forEach((item) => {
    AddItemToDataBlocks(item)
  })

  new window.Sortable($('.person-data-block__data-blocks')[0], {
    handle: '.data-block__selector',
    animation: 500,
    onEnd: (event) => {
      let dataBlock = {
        Id: $(event.item).attr('data-id'),
        Order: event.newIndex + 1,
      }

      UpdateDataBlockOrder(dataBlock)
    },
  })

  $('#person-data-block')
    .find('.data-blocks')
    .find('.data-blocks__item')
    .click(OnDataBlockClick)
}
