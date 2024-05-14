export function AddVideoToVideoModal(video) {
  let videosList = $('#video-modal .videos-list')

  let videosLitsItemElement = $(document.createElement('div'))
  videosLitsItemElement.addClass('videos-list__item')
  videosLitsItemElement.addClass('video-info')
  videosLitsItemElement.attr('data-id', video.Id)

  let videoPreviewImage = $(document.createElement('div'))
  videoPreviewImage.addClass('video-info__preview-image')

  let imgElement = document.createElement('img')
  imgElement.src =
    'data:image/' + video.PreviewImageType + ';base64,' + video.PreviewImageData

  videoPreviewImage.append(imgElement)

  let videoTitleElement = document.createElement('div')
  videoTitleElement.classList.add('video-info__title')
  videoTitleElement.innerHTML = video.Title

  videosLitsItemElement.append(videoPreviewImage)
  videosLitsItemElement.append(videoTitleElement)

  videosList.append(videosLitsItemElement)
}
