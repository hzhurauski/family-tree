export function AddItemToDataCategories(dataCategory) {
  let dataCategoryElement = document.createElement('div')
  dataCategoryElement.classList.add('data-categories__item')
  dataCategoryElement.setAttribute('data-id', dataCategory.Id)
  dataCategoryElement.innerHTML = dataCategory.Name

  let checkboxElement = document.createElement('div')
  checkboxElement.classList.add('checkbox')

  let inputElement = document.createElement('input')
  inputElement.type = 'checkbox'

  checkboxElement.appendChild(inputElement)
  dataCategoryElement.appendChild(checkboxElement)

  $('#person-data-block')
    .find('.data-categories')[0]
    .appendChild(dataCategoryElement)
}
