import { LoadPrivacyData } from '../Privacy/LoadPrivacyData.js'
import { SetPrivacyElementPrivacyLevel } from './SetPrivacyElementPrivacyLevel.js'

export function UpdateSliderImageDetails(imageId) {
  let sliderModal = $('#image-carousel-modal')

  let image = g_currentDataBlockImages.find(item => item.Id == imageId)

  sliderModal.find('#slider-image-title').val(image.Title)

  sliderModal.find('#slider-image-desc').val(image.Description)

  sliderModal
    .find('.pages__current-page')
    .text(sliderModal.find('.slider').slick('slickCurrentSlide') + 1)

  sliderModal.find('.pages__count').text(g_currentDataBlockImages.length)

  if (g_currentPerson.AvatarImageId == imageId) {
    sliderModal
      .find('#set-image-as-avatar-button')
      .prop('disabled', true)[0].innerHTML = 'Уже является изображением персоны'
  } else {
    sliderModal
      .find('#set-image-as-avatar-button')
      .prop('disabled', false)[0].innerHTML = 'Сделать изображением персоны'
  }

  let privacyElement = sliderModal.find('.privacy .privacy__privacy-level')[0]
  SetPrivacyElementPrivacyLevel(privacyElement, image.Privacy.PrivacyLevel)
  g_editPrivacyId = image.Privacy.Id
  LoadPrivacyData(image.Privacy)
}
