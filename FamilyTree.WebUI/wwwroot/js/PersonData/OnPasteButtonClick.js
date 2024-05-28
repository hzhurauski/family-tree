import { PasteAudios } from './PasteAudios.js'
import { PasteDataBlocks } from './PasteDataBlocks.js'
import { PasteDataHolders } from './PasteDataHolders.js'
import { PasteImages } from './PasteImages.js'
import { PasteVideos } from './PasteVideos.js'

export function OnPasteButtonClick() {
  switch (window.g_currentAddButtonActionType) {
    case window.AddButtonActionTypes.AddDataBlock: {
      PasteDataBlocks()
      break
    }
    case window.AddButtonActionTypes.AddDataHolder: {
      PasteDataHolders()
      break
    }
    case window.AddButtonActionTypes.AddImage: {
      PasteImages()
      break
    }
    case window.AddButtonActionTypes.AddVideo: {
      PasteVideos()
      break
    }
    case window.AddButtonActionTypes.AddAudio: {
      PasteAudios()
      break
    }

    default:
      break
  }
}
