import { ClearAudios } from './ClearAudios.js'
import { ClearImages } from './ClearImages.js'
import { ClearParticipants } from './ClearParticipants.js'
import { ClearVideos } from './ClearVideos.js'
import { GetDataCategory } from './GetDataCategory.js'
import { OpenDefaultDataBlockTab } from './OpenDefaultDataBlockTab.js'
import { RefreshAudios } from './RefreshAudios.js'
import { RefreshImages } from './RefreshImages.js'
import { RefreshParticipants } from './RefreshParticipants.js'
import { RefreshVideos } from './RefreshVideos.js'
import { ShowDataBlockButtons } from './ShowDataBlockButtons.js'
import { ShowDataBlockContent } from './ShowDataBlockContent.js'
import { ShowDataBlocks } from './ShowDataBlocks.js'
import { ShowSaveButton } from './ShowSaveButton.js'
import { UpdateAudios } from './UpdateAudios.js'
import { UpdateDataBlocks } from './UpdateDataBlocks.js'
import { UpdateDataHolders } from './UpdateDataHolders.js'
import { UpdateImages } from './UpdateImages.js'
import { UpdateParticipants } from './UpdateParticipants.js'
import { UpdateVideos } from './UpdateVideos.js'

export function OnDataCategoryClick(event) {
  /*GetParticipants();*/
  if ($(event.target).is('input')) return

  let dataCategoryId = $(event.currentTarget).attr('data-id')
  g_currentDataCategory = GetDataCategory(dataCategoryId)

  if (g_currentDataCategory == null) return

  if (
    g_currentDataCategory.DataCategoryType == DataCategoryTypes.InfoBlock ||
    g_currentDataCategory.DataCategoryType == DataCategoryTypes.PersonInfo
  ) {
    ShowDataBlocks(false)
    ShowDataBlockContent()

    g_currentDataBlock = g_currentDataCategory.DataBlocks[0]

    UpdateDataHolders()

    ClearImages()
    ClearVideos()
    ClearAudios()
    ClearParticipants()
    RefreshImages().then((val) => UpdateImages())
    RefreshVideos().then((val) => UpdateVideos())
    RefreshAudios().then((val) => UpdateAudios())
    RefreshParticipants()
      .then((val) => UpdateParticipants())
      .then((val) => ShowSaveButton())

    OpenDefaultDataBlockTab()
  } else if (
    g_currentDataCategory.DataCategoryType == DataCategoryTypes.ListBlock ||
    g_currentDataCategory.DataCategoryType == DataCategoryTypes.Education ||
    g_currentDataCategory.DataCategoryType ==
      DataCategoryTypes.ImportantEvents ||
    g_currentDataCategory.DataCategoryType ==
      DataCategoryTypes.LaborActivities ||
    g_currentDataCategory.DataCategoryType == DataCategoryTypes.Residencies
  ) {
    ShowDataBlocks()
    ShowDataBlockContent(false)
    ShowSaveButton(false)

    g_currentAddButtonActionType = AddButtonActionTypes.AddDataBlock

    UpdateDataBlocks()
  } else {
    return
  }

  ShowDataBlockButtons(false)

  $('#person-data-block')
    .find('.data-categories')
    .find('.data-categories__item')
    .removeClass('data-categories__item_active')

  $(event.currentTarget).addClass('data-categories__item_active')
}
