import { CreateAudio } from './CreateAudio.js'
import { RefreshAudios } from './RefreshAudios.js'
import { UpdateAudios } from './UpdateAudios.js'

export function OnAddAudioSubmitButtonClick() {
  if (window.g_isUploadingAudio) return

  let audioModal = $('#add-audio-modal')

  let files = audioModal.find('#audio-file')[0].files

  if (files.length == 0) {
    alert('Пожалуйста выберите файл.')
    return
  }

  let formData = new FormData()
  formData.append('DataBlockId', window.g_currentDataBlock.Id)
  formData.append('Title', audioModal.find('#audio-title').val())
  formData.append('Description', audioModal.find('#audio-desc').val())
  formData.append('AudioFile', files[0])

  window.g_isUploadingAudio = true
  audioModal.find('#audio-file').prop('disabled', true)

  CreateAudio(formData).then(
    (result) => {
      audioModal.modal('hide')
      RefreshAudios().then((val) => UpdateAudios())
      window.g_isUploadingAudio = false
      audioModal.find('#audio-file').prop('disabled', false)
    },
    (r) => {
      alert('Ошибка при создании аудио.')
      window.g_isUploadingAudio = false
      audioModal.find('#audio-file').prop('disabled', false)
    }
  )
  //CreateParticipant(formData).then((result) => {
  //    audioModal.modal("hide");
  //    RefreshParticipants().then((val) => UpdateParticipants());
  //    g_isUploadingAudio = false;
  //    audioModal.find("#participant").prop("disabled", false);
  //}, (r) => {
  //    alert("Ошибка при создании аудио.");
  //    g_isUploadingAudio = false;
  //    audioModal.find("#participant").prop("disabled", false);
  //});
}
