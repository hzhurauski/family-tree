export function SetPrivacyElementPrivacyLevel(element, privacyLevel) {
  let title = ''

  element.classList.remove('privacy-confidential')
  element.classList.remove('privacy-internal-use')
  element.classList.remove('privacy-public-use')
  element.classList.remove('privacy-top-secret')

  switch (privacyLevel) {
    case window.PrivacyLevels.Confidential: {
      title = 'Личный'
      element.classList.add('privacy-confidential')
      break
    }

    case window.PrivacyLevels.InternalUse: {
      title = 'Внутренний'
      element.classList.add('privacy-internal-use')
      break
    }

    case window.PrivacyLevels.PublicUse: {
      title = 'Публичный'
      element.classList.add('privacy-public-use')
      break
    }

    case window.PrivacyLevels.TopSecret: {
      title = 'Строго секретно'
      element.classList.add('privacy-top-secret')
      break
    }

    default:
      break
  }

  element.setAttribute('title', title)
  element.setAttribute('data-toggle', 'tooltip')
  element.setAttribute('data-placement', 'top')
}
