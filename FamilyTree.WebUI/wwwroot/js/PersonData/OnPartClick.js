import { UpdateParticipants } from './UpdateParticipants.js'

export function OnPartClick(event) {
  if ($(event.target).is('input')) return

  let partId = $(event.currentTarget).attr('data-id')

  UpdateParticipants()

  /* $("#image-carousel-modal").modal("show")*/
}
