import { DeleteSelectedAudios } from './DeleteSelectedAudios.js'
import { DeleteSelectedDataBlocks } from './DeleteSelectedDataBlocks.js'
import { DeleteSelectedDataHolders } from './DeleteSelectedDataHolders.js'
import { DeleteSelectedImages } from './DeleteSelectedImages.js'
import { DeleteSelectedParticipants } from './DeleteSelectedParticipants.js'
import { DeleteSelectedVideos } from './DeleteSelectedVideos.js'
import { RefreshAudios } from './RefreshAudios.js'
import { RefreshDataBlocks } from './RefreshDataBlocks.js'
import { RefreshDataHolders } from './RefreshDataHolders.js'
import { RefreshImages } from './RefreshImages.js'
import { RefreshParticipants } from './RefreshParticipants.js'
import { RefreshVideos } from './RefreshVideos.js'
import { UpdateAudios } from './UpdateAudios.js'
import { UpdateDataBlocks } from './UpdateDataBlocks.js'
import { UpdateDataHolders } from './UpdateDataHolders.js'
import { UpdateImages } from './UpdateImages.js'
import { UpdateParticipants } from './UpdateParticipants.js'
import { UpdateVideos } from './UpdateVideos.js'

export function OnDeleteSubmitButtonClick() {
  switch (window.g_currentAddButtonActionType) {
    case window.AddButtonActionTypes.AddDataBlock: {
      DeleteSelectedDataBlocks().then(val => {
        RefreshDataBlocks()
        UpdateDataBlocks()
        $('#delete-modal').modal('hide')
      })
      break
    }
    case AddButtonActionTypes.AddDataHolder: {
      DeleteSelectedDataHolders().then(val => {
        RefreshDataHolders()
        UpdateDataHolders()
        $('#delete-modal').modal('hide')
      })
      break
    }
    case AddButtonActionTypes.AddImage: {
      DeleteSelectedImages().then(val => {
        RefreshImages().then(val => {
          UpdateImages()
          $('#delete-modal').modal('hide')
        })
      })
      break
    }
    case AddButtonActionTypes.AddVideo: {
      DeleteSelectedVideos().then(val => {
        RefreshVideos().then(val => {
          UpdateVideos()
          $('#delete-modal').modal('hide')
        })
      })
      break
    }
    case AddButtonActionTypes.AddAudio: {
      DeleteSelectedAudios().then(val => {
        RefreshAudios().then(val => {
          UpdateAudios()
          $('#delete-modal').modal('hide')
        })
      })
      break
    }
    case AddButtonActionTypes.AddParticipant: {
      DeleteSelectedParticipants().then(val => {
        RefreshParticipants().then(val => {
          UpdateParticipants()
          $('#delete-modal').modal('hide')
        })
      })
      break
    }

    default:
      break
  }
}
