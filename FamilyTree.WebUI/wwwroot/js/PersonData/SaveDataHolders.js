import { UpdateDataHolderData } from './UpdateDataHolderData.js'

export async function SaveDataHolders() {
  let dataHolders = $('#person-data-block').find(
    '.data-holders .data-holders__item'
  )

  let updatedDataHolders = [] //Use updatedDataHolders array to avoid jQuery object each() iterating, because it cannot execute asynchronously
  // мотивация трудовой деятельности и подходы к её повышению
  dataHolders.each(async (i, el) => {
    let data = ''

    if (el.classList.contains('data-holder-gender')) {
      data = $(el).find('input[type="radio"]:checked').val()
    } else if (el.classList.contains('data-holder-textarea')) {
      data = $(el).find('textarea').val()
    } else {
      data = $(el).find('.data-holder__data input').val()
    }
    let dataHolder = {
      Id: el.getAttribute('data-id'),
      Data: data,
    }

    updatedDataHolders.push(dataHolder)
  })

  for (const dh of updatedDataHolders) {
    await UpdateDataHolderData(dh).catch(r => {
      console.error(r)
    })
  }
}
