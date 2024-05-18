import { RefreshAudios } from './RefreshAudios.js'
import { UpdateAudioDetails } from './UpdateAudioDetails.js'
import { UpdateAudios } from './UpdateAudios.js'

export function OnSaveAudioSubmitButtonClick() {
  let audioModal = $('#audio-modal')

  let audio = {
    Id: g_openedAudioId,
    Title: audioModal.find('#current-audio-title').val(),
    Description: audioModal.find('#current-audio-desc').val(),
  }

  UpdateAudioDetails(audio).then(
    (result) => {
      RefreshAudios().then((result) => {
        UpdateAudios()
      })
    },
    (r) => {
      alert('Ошибка при сохранении информации аудио.')
    }
  )
}
