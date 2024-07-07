export function OnAddElementButtonClick() {
  switch (window.g_currentAddButtonActionType) {
    case window.AddButtonActionTypes.AddDataBlock: {
      $('#add-data-block-modal').modal('show')
      break
    }
    case window.AddButtonActionTypes.AddDataHolder: {
      $('#add-data-holder-modal').modal('show')
      break
    }
    case window.AddButtonActionTypes.AddImage: {
      $('#add-image-modal').modal('show')
      break
    }
    case window.AddButtonActionTypes.AddVideo: {
      $('#add-video-modal').modal('show')
      break
    }
    case window.AddButtonActionTypes.AddAudio: {
      $('#add-audio-modal').modal('show')
      break
    }

    default:
      break
  }
}
