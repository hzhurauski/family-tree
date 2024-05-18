export function InverseSelectCheckboxes(elements) {
  $(elements)
    .find('input[type="checkbox"]')
    .each((i, el) => {
      $(el).prop('checked', $(el).prop('checked') == true ? false : true)
    })
}
