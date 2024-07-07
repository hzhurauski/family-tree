export function AddItemToDataBlocks(dataBlock) {
  let dataBlockElement = document.createElement('div')
  dataBlockElement.classList.add('data-blocks__item')
  dataBlockElement.classList.add('data-block')
  dataBlockElement.setAttribute('data-id', dataBlock.Id)

  let dataBlockHeaderElement = document.createElement('div')
  dataBlockHeaderElement.classList.add('data-block__header')
  let dataBlockFooterElement = document.createElement('div')
  dataBlockFooterElement.classList.add('data-block__footer')
  let dataBlockBodyElement = document.createElement('div')
  dataBlockBodyElement.classList.add('data-block__body')

  let dataBlockSelectorElement = document.createElement('div')
  dataBlockSelectorElement.classList.add('data-block__selector')
  let checkboxElement = document.createElement('div')
  checkboxElement.classList.add('checkbox')
  let checkboxInputElement = document.createElement('input')
  checkboxInputElement.type = 'checkbox'
  checkboxElement.appendChild(checkboxInputElement)
  dataBlockSelectorElement.appendChild(checkboxElement)

  let dataBlockContentElement = document.createElement('div')
  dataBlockContentElement.classList.add('data-block__content')

  let dataBlockItemElement = document.createElement('div')
  dataBlockItemElement.classList.add('data-block__item')

  let dataBlockTitleElement = document.createElement('div')
  dataBlockTitleElement.classList.add('data-block__title')
  dataBlockTitleElement.innerHTML = dataBlock.Title

  dataBlockItemElement.appendChild(dataBlockTitleElement)

  dataBlockContentElement.appendChild(dataBlockItemElement)

  dataBlockBodyElement.appendChild(dataBlockSelectorElement)
  dataBlockBodyElement.appendChild(dataBlockContentElement)

  dataBlockElement.appendChild(dataBlockHeaderElement)
  dataBlockElement.appendChild(dataBlockBodyElement)
  dataBlockElement.appendChild(dataBlockFooterElement)

  $('#person-data-block').find('.data-blocks')[0].appendChild(dataBlockElement)
}
