export function ShowDataBlockButtons(isShow = true) {
  $('#person-data-block').find('#back-to-data-blocks-button')[0].style.display =
    isShow ? 'inline-block' : 'none'
  $('#person-data-block').find('#tab-button-participants')[0].style.display =
    isShow ? '' : 'none'
}
