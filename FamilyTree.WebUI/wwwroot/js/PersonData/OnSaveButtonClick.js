import { IsViewDataBlockAsParticipant } from './IsViewDataBlockAsParticipant.js'
import { SaveCopiedDataAsParticipant } from './SaveCopiedDataAsParticipant.js'
import { SaveData } from './SaveData.js'

export function OnSaveButtonClick() {
  if (g_isSaving) return
  if (
    $('#person-data-block').find('.data-holders .data-holders__item').length ===
    0
  )
    return
  g_isSaving = true

  IsViewDataBlockAsParticipant() ? SaveCopiedDataAsParticipant() : SaveData()
}
