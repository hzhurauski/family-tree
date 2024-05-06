import { RefreshDataBlocks } from './RefreshDataBlocks.js'
import { SelectParticipant } from './SelectParticipant.js'
import { UpdateDataBlocks } from './UpdateDataBlocks.js'

export function OnSelectParticipantButtonClick() {
  SelectParticipant().then(value => {
    RefreshDataBlocks()
    UpdateDataBlocks()
  })
}
