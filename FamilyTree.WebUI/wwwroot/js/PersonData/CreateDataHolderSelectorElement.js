export function CreateDataHolderSelectorElement(dataHolder) {
  let dataHolderSelectorElement = document.createElement('div')
  dataHolderSelectorElement.classList.add('data-holder__selector')

  let checkboxElement = document.createElement('div')
  checkboxElement.classList.add('checkbox')
  let checkboxInputElement = document.createElement('input')
  checkboxInputElement.type = 'checkbox'

  checkboxElement.appendChild(checkboxInputElement)
  dataHolderSelectorElement.appendChild(checkboxElement)

  return dataHolderSelectorElement
}
