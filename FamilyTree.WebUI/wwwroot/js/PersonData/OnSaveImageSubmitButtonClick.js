import { GetImageSliderCurrentImageId } from './GetImageSliderCurrentImageId.js'
import { RefreshImages } from './RefreshImages.js'
import { UpdateImageDetails } from './UpdateImageDetails.js'
import { UpdateSliderImageDetails } from './UpdateSliderImageDetails.js'

export function OnSaveImageSubmitButtonClick() {
  let currentImageId = GetImageSliderCurrentImageId()
  let sliderModal = $('#image-carousel-modal')

  let image = {
    Id: currentImageId,
    Title: sliderModal.find('#slider-image-title').val(),
    Description: sliderModal.find('#slider-image-desc').val(),
  }

  if (!UpdateImageDetails(image)) {
    alert('Ошибка при сохранении данных изображения.')
  } else {
    RefreshImages().then(val => UpdateSliderImageDetails(currentImageId))
  }
}
