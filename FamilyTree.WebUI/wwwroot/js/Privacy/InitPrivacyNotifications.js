import { GetDataHolder } from '../PersonData/GetDataHolder.js'
import { RefreshAudios } from '../PersonData/RefreshAudios.js'
import { RefreshImages } from '../PersonData/RefreshImages.js'
import { RefreshVideos } from '../PersonData/RefreshVideos.js'
import { UpdateAudioModalAudioPrivacy } from '../PersonData/UpdateAudioModalAudioPrivacy.js'
import { UpdateDataHolders } from '../PersonData/UpdateDataHolders.js'
import { UpdateImageSliderImagePrivacy } from '../PersonData/UpdateImageSliderImagePrivacy.js'
import { UpdateVideoModalVideoPrivacy } from '../PersonData/UpdateVideoModalVideoPrivacy.js'

let g_privacyNotificationsConnection = null

//Notifications
export function InitPrivacyNotifications() {
  g_privacyNotificationsConnection = new window.signalR.HubConnectionBuilder()
    .withUrl('/Privacy/Notifications')
    .build()

  g_privacyNotificationsConnection.on(
    'ReceivePrivacyChangedNotification',
    (privacyId) => {
      if (
        window.g_currentAddButtonActionType ==
        window.AddButtonActionTypes.AddDataHolder
      ) {
        let dataHolderIndex = window.g_currentDataBlock.DataHolders.findIndex(
          (item) => item.Privacy.Id == privacyId
        )

        if (dataHolderIndex !== -1) {
          let dataHolderId =
            window.g_currentDataBlock.DataHolders[dataHolderIndex].Id

          GetDataHolder(dataHolderId).then(
            (result) => {
              window.g_currentDataBlock.DataHolders[dataHolderIndex] = result
              UpdateDataHolders()
            },
            (r) => console.error(r)
          )
        }
      } else if ($('#image-carousel-modal').hasClass('in')) {
        RefreshImages().then((result) => {
          UpdateImageSliderImagePrivacy()
        })
      } else if ($('#video-modal').hasClass('in')) {
        RefreshVideos().then((result) => {
          UpdateVideoModalVideoPrivacy()
        })
      } else if ($('#audio-modal').hasClass('in')) {
        RefreshAudios().then((result) => {
          UpdateAudioModalAudioPrivacy()
        })
      }
    }
  )

  g_privacyNotificationsConnection
    .start()
    .catch((error) => console.error(error.Message))
}
