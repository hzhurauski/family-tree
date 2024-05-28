import { ReloadTree } from '../LoadTree/LoadTree.js'
import { GetImageSliderCurrentImageId } from './GetImageSliderCurrentImageId.js'
import { GetPersonData } from './GetPersonData.js'
import { UpdatePersonAvatarImage } from './UpdatePersonAvatarImage.js'
import { UpdateSliderImageDetails } from './UpdateSliderImageDetails.js'

export function OnSetImageAsAvatarButtonClick() {
  $('#image-carousel-modal')
    .find('#set-image-as-avatar-button')
    .prop('disabled', true)
  UpdatePersonAvatarImage(
    window.g_currentPerson.Id,
    GetImageSliderCurrentImageId()
  ).then(
    (result) => {
      ReloadTree(window._currentFamilyTree.MainPersonId)
      GetPersonData(window.g_currentPerson.Id).then((result) => {
        window.g_currentPerson = result
        UpdateSliderImageDetails(GetImageSliderCurrentImageId())
      })
    },
    (r) => {
      alert('Ошибка при задании изображения аватара персоны.')
    }
  )
}
