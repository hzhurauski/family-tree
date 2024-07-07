import { ShowDataBlockButtons } from './ShowDataBlockButtons.js'
import { ShowDataBlockContent } from './ShowDataBlockContent.js'
import { ShowDataBlocks } from './ShowDataBlocks.js'
import { ShowSaveButton } from './ShowSaveButton.js'

export function OnBackToDataBlocksButtonClick() {
  ShowDataBlocks()
  ShowDataBlockContent(false)
  ShowDataBlockButtons(false)
  ShowSaveButton(false)
  window.g_currentAddButtonActionType = window.AddButtonActionTypes.AddDataBlock
}
