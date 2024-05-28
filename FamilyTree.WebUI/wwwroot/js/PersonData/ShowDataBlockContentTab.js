export function ShowDataBlockContentTab(dataBlockContentTab) {
  let dataBlockContentTabsContainersElement = $('#person-data-block')
    .find('.data-block-content')
    .find('.tabs-containers')

  dataBlockContentTabsContainersElement.children().css('display', 'none')

  switch (dataBlockContentTab) {
    case window.DataBlockContentTabs.Data: {
      dataBlockContentTabsContainersElement
        .find('.data-holders')
        .css('display', 'block')
      break
    }
    case window.DataBlockContentTabs.Images: {
      dataBlockContentTabsContainersElement
        .find('.images')
        .css('display', 'grid')
      break
    }
    case window.DataBlockContentTabs.Videos: {
      dataBlockContentTabsContainersElement
        .find('.videos')
        .css('display', 'block')
      break
    }
    case window.DataBlockContentTabs.Audios: {
      dataBlockContentTabsContainersElement
        .find('.audios')
        .css('display', 'block')
      break
    }
    case window.DataBlockContentTabs.Participants: {
      dataBlockContentTabsContainersElement
        .find('.participants')
        .css('display', 'block')
      break
    }

    default:
      break
  }
}
