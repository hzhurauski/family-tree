import { CreateParticipants } from './CreateParticipants.js'
import { GetSelectedParticipantIds } from './GetSelectedParticipantIds.js'
import { RefreshParticipants } from './RefreshParticipants.js'
import { UpdateParticipants } from './UpdateParticipants.js'

export async function DeleteSelectedParticipants() {
  let participantIds = GetSelectedParticipantIds()

  if (participantIds.length == 0) return

  let debug = participantIds.indexOf(
    window.g_currentDataBlockParticipants[0].Id
  )

  window.g_currentDataBlockParticipants =
    window.g_currentDataBlockParticipants.filter(
      (x) => participantIds.indexOf(x.Id) < 0
    )

  CreateParticipants().then((res) =>
    RefreshParticipants().then((val) => UpdateParticipants())
  )
}
