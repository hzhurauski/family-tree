import { CopySelectedAudios } from './CopySelectedAudios.js'
import { CopySelectedDataBlocks } from './CopySelectedDataBlocks.js'
import { CopySelectedDataHolders } from './CopySelectedDataHolders.js'
import { CopySelectedImages } from './CopySelectedImages.js'
import { CopySelectedVideos } from './CopySelectedVideos.js'

export function OnCopyButtonClick() {
  switch (window.g_currentAddButtonActionType) {
    case window.AddButtonActionTypes.AddDataBlock: {
      CopySelectedDataBlocks()
      break
    }
    case window.AddButtonActionTypes.AddDataHolder: {
      CopySelectedDataHolders()
      break
    }
    case window.AddButtonActionTypes.AddImage: {
      CopySelectedImages()
      break
    }
    case window.AddButtonActionTypes.AddVideo: {
      CopySelectedVideos()
      break
    }
    case window.AddButtonActionTypes.AddAudio: {
      CopySelectedAudios()
      break
    }

    default:
      break
  }
}
