export function SelectVideoModalVideo(videoId) {
  let videosListElement = $('#video-modal .videos-list')

  videosListElement.children().removeClass('videos-list__item_active')

  videosListElement
    .find('.videos-list__item[data-id="' + videoId + '"]')
    .addClass('videos-list__item_active')
}
