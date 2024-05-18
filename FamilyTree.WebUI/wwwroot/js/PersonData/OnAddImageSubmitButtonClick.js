import { CreateImage } from './CreateImage.js'
import { RefreshImages } from './RefreshImages.js'
import { UpdateImages } from './UpdateImages.js'

export function OnAddImageSubmitButtonClick() {
  if (window.g_isUploadingImage) return

  let imageModal = $('#add-image-modal')

  let files = imageModal.find('#image-file')[0].files

  if (files.length == 0) {
    alert('Пожалуйста выберите файл.')
    return
  }

  //File must be smaller than 2 GB
  if (files[0].size > 2147483647) {
    alert('Размер файла превышает лимит в 2 ГБ')
    return
  }

  let formData = new FormData()
  formData.append('DataBlockId', window.g_currentDataBlock.Id)
  formData.append('Title', imageModal.find('#image-title').val())
  formData.append('Description', imageModal.find('#image-desc').val())
  formData.append('ImageFile', files[0])

  window.g_isUploadingImage = true
  imageModal.find('#image-file').prop('disabled', true)

  CreateImage(formData).then(
    (result) => {
      imageModal.modal('hide')
      RefreshImages().then((val) => UpdateImages())
      window.g_isUploadingImage = false
      imageModal.find('#image-file').prop('disabled', false)
    },
    (r) => {
      alert('Ошибка при создании изображения.')
      window.g_isUploadingImage = false
      imageModal.find('#image-file').prop('disabled', false)
    }
  )
}
