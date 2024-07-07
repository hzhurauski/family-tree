export function SelectAllCheckboxes(elements) {
  $(elements).find('input[type="checkbox"]').prop('checked', true)
}
