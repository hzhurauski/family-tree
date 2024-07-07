export function GetSelectedDataCategoriesIds() {
  let result = []

  $('#person-data-block')
    .find('.data-categories .data-categories__item')
    .each((i, el) => {
      if ($(el).find('input[type="checkbox"]').is(':checked')) {
        result.push(el.getAttribute('data-id'))
      }
    })

  return result
}
