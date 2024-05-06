import { CreateParticipants } from './CreateParticipants.js'
import { RefreshParticipants } from './RefreshParticipants.js'
import { UpdateParticipants } from './UpdateParticipants.js'

export function OnAddParticipantSubmitButtonClick() {
  let partModal = $('#add-participant-modal')

  partModal.modal('hide')
  RefreshParticipants().then(val => UpdateParticipants())

  CreateParticipants().then(result => {
    RefreshParticipants().then(val => UpdateParticipants())
    partModal.find('#participant').prop('disabled', false)
  })
}
