export function GetCurrentActionTypeElements() {
  let elements = null
  let personDataBlock = $('#person-data-block')
  switch (g_currentAddButtonActionType) {
    case AddButtonActionTypes.AddDataBlock: {
      elements = personDataBlock.find('.data-blocks .data-blocks__item')
      break
    }
    case AddButtonActionTypes.AddDataHolder: {
      elements = personDataBlock.find('.data-holders .data-holders__item')
      break
    }
    case AddButtonActionTypes.AddImage: {
      elements = personDataBlock.find('.images .images__item')
      break
    }
    case AddButtonActionTypes.AddVideo: {
      elements = personDataBlock.find('.videos .videos__item')
      break
    }
    case AddButtonActionTypes.AddAudio: {
      elements = personDataBlock.find('.audios .audios__item')
      break
    }
    case AddButtonActionTypes.AddParticipant: {
      elements = personDataBlock.find('.participants .participants__item')
      break
    }

    default:
      return
  }

  return elements
}
