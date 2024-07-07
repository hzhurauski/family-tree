export function GetSelectedDataHoldersIds() {
  let result = []

  $('#person-data-block')
    .find('.data-holders .data-holders__item')
    .each((i, el) => {
      if ($(el).find('input[type="checkbox"]').is(':checked')) {
        result.push(el.getAttribute('data-id'))
      }
    })

  return result
}
