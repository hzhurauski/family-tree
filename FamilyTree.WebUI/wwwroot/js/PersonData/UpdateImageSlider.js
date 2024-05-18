import { AddImageToSlider } from './AddImageToSlider.js'
import { ClearSliderImages } from './ClearSliderImages.js'
import { UpdateSliderImageDetails } from './UpdateSliderImageDetails.js'

export function UpdateImageSlider(imageId) {
  let slider = $('#image-carousel-modal').find('.slider')

  if (slider.hasClass('slick-initialized')) {
    slider.slick('unslick')
    ClearSliderImages()
  }

  if (g_currentDataBlockImages == null) return

  g_currentDataBlockImages.forEach((item) => {
    AddImageToSlider(item)
  })

  let initialSlide = 0

  let selectedImage = g_currentDataBlockImages.find(
    (item) => item.Id == imageId
  )

  initialSlide = g_currentDataBlockImages.indexOf(selectedImage)

  slider.slick({
    slidesToScroll: 1,
    slidesToShow: 1,
    draggable: false,
    arrows: true,
    variableWidth: true,
  })

  slider.find('.slick-arrow').click(OnSliderArrowClick)

  slider.slick('slickGoTo', initialSlide, false)

  UpdateSliderImageDetails(imageId)
}
