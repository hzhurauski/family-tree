export async function UpdateDataHolderIds(dataHolders) {
  let currentDataHolders = $('#person-data-block').find(
    '.data-holders .data-holders__item'
  )

  currentDataHolders.each((i, el) => {
    updatedId = dataHolders.find(x => x.Title === el.innerText).Id

    el.setAttribute('data-id', updatedId)
  })
}
