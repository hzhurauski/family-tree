import { LoadPrivacyData } from '../Privacy/LoadPrivacyData.js'
import { SetPrivacyElementPrivacyLevel } from './SetPrivacyElementPrivacyLevel.js'

export function UpdateVideoModal(videoId) {
  let videoModal = $('#video-modal')
  let currentVideoElement = videoModal.find('#current-video')[0]

  let currentVideo = window.g_currentDataBlockVideos.find(
    (item) => item.Id == videoId
  )

  videoModal.find('#current-video-title').val(currentVideo.Title)
  videoModal.find('#current-video-desc').val(currentVideo.Description)

  currentVideoElement.poster =
    'data:image/' +
    currentVideo.PreviewImageType +
    ';base64,' +
    currentVideo.PreviewImageData
  currentVideoElement.src = 'Media/Video/GetFile/' + videoId
  currentVideoElement.volume = 0.1

  let privacyElement = videoModal.find('.privacy .privacy__privacy-level')[0]
  SetPrivacyElementPrivacyLevel(
    privacyElement,
    currentVideo.Privacy.PrivacyLevel
  )
  window.g_editPrivacyId = currentVideo.Privacy.Id
  LoadPrivacyData(currentVideo.Privacy)
}
