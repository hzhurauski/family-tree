export function GetPartModalCurrentPartId() {
  return $('#part-modal .part-list .part-list__item_active').attr('data-id')
}
