export function CreateDataHolderPrivacyElement(dataHolder) {
  let dataHolderPrivacyElement = document.createElement('div')
  dataHolderPrivacyElement.classList.add('data-holder__privacy')
  dataHolderPrivacyElement.setAttribute('data-toggle', 'tooltip')
  dataHolderPrivacyElement.setAttribute('data-placement', 'right')

  let title = ''

  if (dataHolder.Privacy == null) {
    title = 'Личный'
    dataHolderPrivacyElement.classList.add('privacy-confidential')
  } else {
    switch (dataHolder.Privacy.PrivacyLevel) {
      case window.PrivacyLevels.Confidential: {
        title = 'Личный'
        dataHolderPrivacyElement.classList.add('privacy-confidential')
        break
      }

      case window.PrivacyLevels.InternalUse: {
        title = 'Внутренний'
        dataHolderPrivacyElement.classList.add('privacy-internal-use')
        break
      }

      case window.PrivacyLevels.PublicUse: {
        title = 'Публичный'
        dataHolderPrivacyElement.classList.add('privacy-public-use')
        break
      }

      case window.PrivacyLevels.TopSecret: {
        title = 'Строго секретно'
        dataHolderPrivacyElement.classList.add('privacy-top-secret')
        break
      }

      default:
        break
    }
  }

  dataHolderPrivacyElement.setAttribute('title', title)

  return dataHolderPrivacyElement
}
