import { AddVideoToVideoModal } from './AddVideoToVideoModal.js'
import { ClearVideoModalVideos } from './ClearVideoModalVideos.js'
import { OnVideoModalVideoClick } from './OnVideoModalVideoClick.js'

export function UpdateVideoModalVideos() {
  ClearVideoModalVideos()

  if (window.g_currentDataBlockVideos == null) return

  window.g_currentDataBlockVideos.forEach((item) => {
    AddVideoToVideoModal(item)
  })

  $('#video-modal .videos-list .videos-list__item').click(
    OnVideoModalVideoClick
  )
}
