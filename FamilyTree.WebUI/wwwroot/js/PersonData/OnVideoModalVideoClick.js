import { SelectVideoModalVideo } from './SelectVideoModalVideo.js'
import { UpdateVideoModal } from './UpdateVideoModal.js'

export function OnVideoModalVideoClick(event) {
  let videosListItemElement = $(event.currentTarget)
  let videoId = videosListItemElement.attr('data-id')

  UpdateVideoModal(videoId)

  SelectVideoModalVideo(videoId)
}
