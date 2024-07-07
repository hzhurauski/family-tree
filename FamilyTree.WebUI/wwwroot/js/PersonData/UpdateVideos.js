import { AddItemToVideos } from './AddItemToVideos.js'
import { ClearVideos } from './ClearVideos.js'
import { OnVideoClick } from './OnVideoClick.js'

export function UpdateVideos() {
  ClearVideos()

  if (window.g_currentDataBlockVideos == null) return

  window.g_currentDataBlockVideos.forEach((item) => {
    AddItemToVideos(item)
  })

  $('#person-data-block').find('.videos .videos__item').click(OnVideoClick)
}
