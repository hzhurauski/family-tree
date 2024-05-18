export function CreateDataHolderTitleElement(dataHolder) {
  let dataHolderTitleElement = document.createElement('div')
  dataHolderTitleElement.classList.add('data-holder__title')
  let titleElement = document.createElement('div')
  titleElement.innerHTML = dataHolder.Title
  dataHolderTitleElement.appendChild(titleElement)

  return dataHolderTitleElement
}
