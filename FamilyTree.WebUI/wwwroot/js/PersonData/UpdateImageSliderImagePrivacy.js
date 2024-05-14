import { GetImageSliderCurrentImageId } from './GetImageSliderCurrentImageId.js'
import { SetPrivacyElementPrivacyLevel } from './SetPrivacyElementPrivacyLevel.js'

export function UpdateImageSliderImagePrivacy() {
  let sliderModal = $('#image-carousel-modal')
  let image = g_currentDataBlockImages.find(
    (item) => item.Id == GetImageSliderCurrentImageId()
  )

  if (image == null) return

  let privacyElement = sliderModal.find('.privacy .privacy__privacy-level')[0]
  SetPrivacyElementPrivacyLevel(privacyElement, image.Privacy.PrivacyLevel)
}
