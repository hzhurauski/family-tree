export function DeselectAllCheckboxes(elements) {
  $(elements).find('input[type="checkbox"]').prop('checked', false)
}
