export function GetSelectedDataBlocksIds() {
  let result = []

  $('#person-data-block')
    .find('.data-blocks .data-blocks__item')
    .each((i, el) => {
      if ($(el).find('input[type="checkbox"]').is(':checked')) {
        result.push(el.getAttribute('data-id'))
      }
    })

  return result
}
