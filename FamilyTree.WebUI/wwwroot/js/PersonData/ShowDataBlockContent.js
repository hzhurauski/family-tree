export function ShowDataBlockContent(isShow = true) {
  $('#person-data-block').find('.data-block-content')[0].style.display = isShow
    ? 'block'
    : 'none'
}
