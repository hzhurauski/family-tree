import { ClearAudios } from './ClearAudios.js'
import { ClearImages } from './ClearImages.js'
import { ClearParticipants } from './ClearParticipants.js'
import { ClearVideos } from './ClearVideos.js'
import { OpenDefaultDataBlockTab } from './OpenDefaultDataBlockTab.js'
import { RefreshAudios } from './RefreshAudios.js'
import { RefreshImages } from './RefreshImages.js'
import { RefreshParticipants } from './RefreshParticipants.js'
import { RefreshVideos } from './RefreshVideos.js'
import { ShowDataBlockButtons } from './ShowDataBlockButtons.js'
import { ShowDataBlockContent } from './ShowDataBlockContent.js'
import { ShowDataBlocks } from './ShowDataBlocks.js'
import { ShowSaveButton } from './ShowSaveButton.js'
import { UpdateAudios } from './UpdateAudios.js'
import { UpdateDataHolders } from './UpdateDataHolders.js'
import { UpdateImages } from './UpdateImages.js'
import { UpdateParticipants } from './UpdateParticipants.js'
import { UpdateVideos } from './UpdateVideos.js'

export function RefreshDataBlock(dataBlockId) {
  let dataBlock = g_currentDataCategory.DataBlocks.find(
    (item) => item.Id == dataBlockId
  )

  g_currentDataBlock = dataBlock
  g_currentAddButtonActionType = AddButtonActionTypes.AddDataHolder

  UpdateDataHolders()

  ClearImages()
  ClearVideos()
  ClearAudios()
  ClearParticipants()
  RefreshImages().then((val) => UpdateImages())
  RefreshVideos().then((val) => UpdateVideos())
  RefreshAudios().then((val) => UpdateAudios())
  RefreshParticipants()
    .then((val) => UpdateParticipants())
    .then((val) => ShowSaveButton())

  ShowDataBlockButtons()
  ShowDataBlocks(false)
  ShowDataBlockContent()
  OpenDefaultDataBlockTab()
}
