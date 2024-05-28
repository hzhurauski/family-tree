import { UpdateAudioModal } from './UpdateAudioModal.js'

export function OnPlayAudioButtonClick(event) {
  let audioId = $(event.currentTarget).parent().attr('data-id')

  window.g_openedAudioId = audioId

  UpdateAudioModal(audioId)

  $('#audio-modal').modal('show')

  $('#audio-modal #current-audio')[0].play()
}
