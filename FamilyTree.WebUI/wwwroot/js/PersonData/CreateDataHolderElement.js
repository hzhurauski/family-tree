/**
 * Создает поле для ввода персональных данных человека,
 * которого создают либо редактируют. Это поле используется в
 * окне создания/редактирования данных о человеке.
 *
 * Так же существуют методы, которые заполняет это поле для ввода
 * данных разным типом input, например:
 * * CreateDataHolderSelectorElement(dataHolder)
 * * CreateDataHolderTitleElement(dataHolder)
 * * CreateDataHolderPrivacyElement(dataHolder)
 */
export function CreateDataHolderElement(dataHolder) {
  let dataHolderElement = document.createElement('div')
  dataHolderElement.classList.add('data-holders__item')
  dataHolderElement.classList.add('data-holder')
  dataHolderElement.setAttribute('data-id', dataHolder.Id)
  return dataHolderElement
}
