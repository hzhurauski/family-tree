import { OnAddAudioSubmitButtonClick } from './OnAddAudioSubmitButtonClick.js'
import { OnAddDataBlockSubmitButtonClick } from './OnAddDataBlockSubmitButtonClick.js'
import { OnAddDataCategoryButtonClick } from './OnAddDataCategoryButtonClick.js'
import { OnAddDataCategorySubmitButtonClick } from './OnAddDataCategorySubmitButtonClick.js'
import { OnAddDataHolderSubmitButtonClick } from './OnAddDataHolderSubmitButtonClick.js'
import { OnAddElementButtonClick } from './OnAddElementButtonClick.js'
import { OnAddImageSubmitButtonClick } from './OnAddImageSubmitButtonClick.js'
import { OnAddParticipantSubmitButtonClick } from './OnAddParticipantSubmitButtonClick.js'
import { OnAddVideoSubmitButtonClick } from './OnAddVideoSubmitButtonClick.js'
import { OnBackToDataBlocksButtonClick } from './OnBackToDataBlocksButtonClick.js'
import { OnCopyButtonClick } from './OnCopyButtonClick.js'
import { OnCopyDataCategoryButtonClick } from './OnCopyDataCategoryButtonClick.js'
import { OnDeleteButtonClick } from './OnDeleteButtonClick.js'
import { OnDeleteDataCategoryButtonClick } from './OnDeleteDataCategoryButtonClick.js'
import { OnDeleteDataCategorySubmitButtonClick } from './OnDeleteDataCategorySubmitButtonClick.js'
import { OnDeleteSubmitButtonClick } from './OnDeleteSubmitButtonClick.js'
import { OnDeselectAllButtonClick } from './OnDeselectAllButtonClick.js'
import { OnEditAudioPrivacyButtonClick } from './OnEditAudioPrivacyButtonClick.js'
import { OnEditDataBlockSubmitButtonClick } from './OnEditDataBlockSubmitButtonClick.js'
import { OnEditDataCategoryButtonClick } from './OnEditDataCategoryButtonClick.js'
import { OnEditDataCategorySubmitButtonClick } from './OnEditDataCategorySubmitButtonClick.js'
import { OnEditDataHolderSubmitButtonClick } from './OnEditDataHolderSubmitButtonClick.js'
import { OnEditElementButtonClick } from './OnEditElementButtonClick.js'
import { OnEditImagePrivacyButtonClick } from './OnEditImagePrivacyButtonClick.js'
import { OnEditPrivacyButtonClick } from './OnEditPrivacyButtonClick.js'
import { OnEditVideoPrivacyButtonClick } from './OnEditVideoPrivacyButtonClick.js'
import { OnInvertSelectionButtonClick } from './OnInvertSelectionButtonClick.js'
import { OnPasteButtonClick } from './OnPasteButtonClick.js'
import { OnPasteDataCategoryButtonClick } from './OnPasteDataCategoryButtonClick.js'
import { OnPasteParticipantButton } from './OnPasteParticipantButton.js'
import { OnSaveAudioSubmitButtonClick } from './OnSaveAudioSubmitButtonClick.js'
import { OnSaveButtonClick } from './OnSaveButtonClick.js'
import { OnSaveImageSubmitButtonClick } from './OnSaveImageSubmitButtonClick.js'
import { OnSaveVideoSubmitButtonClick } from './OnSaveVideoSubmitButtonClick.js'
import { OnSelectAllButtonClick } from './OnSelectAllButtonClick.js'
import { OnSelectParticipantButtonClick } from './OnSelectParticipantButtonClick.js'
import { OnSetImageAsAvatarButtonClick } from './OnSetImageAsAvatarButtonClick.js'
import { OnTabButtonClick } from './OnTabButtonClick.js'

export function InitPersonDataBlockButtonEvents() {
  $('#person-data-block')
    .find('.data-block-content')
    .find('.tabs-buttons')
    .find('.tabs-buttons__button')
    .click(OnTabButtonClick)

  $('#add-data-category-button').click(OnAddDataCategoryButtonClick)

  $('#edit-data-category-button').click(OnEditDataCategoryButtonClick)

  $('#copy-data-category-button').click(OnCopyDataCategoryButtonClick)

  $('#paste-data-category-button').click(OnPasteDataCategoryButtonClick)

  $('#delete-data-category-button').click(OnDeleteDataCategoryButtonClick)

  $('#delete-data-category-submit-button').click(
    OnDeleteDataCategorySubmitButtonClick
  )

  $('#add-data-category-submit-button').click(
    OnAddDataCategorySubmitButtonClick
  )

  $('#add-data-block-submit-button').click(OnAddDataBlockSubmitButtonClick)

  $('#add-data-holder-submit-button').click(OnAddDataHolderSubmitButtonClick)

  $('#back-to-data-blocks-button').click(OnBackToDataBlocksButtonClick)

  $('#add-element-button').click(OnAddElementButtonClick)

  $('#delete-button').click(OnDeleteButtonClick)

  $('#edit-element-button').click(OnEditElementButtonClick)

  $('#copy-button').click(OnCopyButtonClick)

  $('#paste-button').click(OnPasteButtonClick)

  $('#paste-participant-button').click(OnPasteParticipantButton)

  $('#select-all-button').click(OnSelectAllButtonClick)

  $('#deselect-all-button').click(OnDeselectAllButtonClick)

  $('#invert-selection-button').click(OnInvertSelectionButtonClick)

  $('#save-elements-button').click(OnSaveButtonClick)

  $('#edit-privacy-button').click(OnEditPrivacyButtonClick)

  $('#edit-data-category-submit-button').click(
    OnEditDataCategorySubmitButtonClick
  )

  $('#edit-data-block-submit-button').click(OnEditDataBlockSubmitButtonClick)

  $('#edit-data-holder-submit-button').click(OnEditDataHolderSubmitButtonClick)

  $('#add-image-submit-button').click(OnAddImageSubmitButtonClick)

  $('#save-image-submit-button').click(OnSaveImageSubmitButtonClick)

  $('#set-image-as-avatar-button').click(OnSetImageAsAvatarButtonClick)

  $('#add-video-submit-button').click(OnAddVideoSubmitButtonClick)

  $('#save-video-submit-button').click(OnSaveVideoSubmitButtonClick)

  $('#delete-submit-button').click(OnDeleteSubmitButtonClick)

  $('#add-audio-submit-button').click(OnAddAudioSubmitButtonClick)

  $('#add-participant-submit-button').click(OnAddParticipantSubmitButtonClick)

  $('#save-audio-submit-button').click(OnSaveAudioSubmitButtonClick)

  $('#video-modal').on('hidden.bs.modal', e => {
    $('#video-modal #current-video')[0].pause()
  })

  $('#audio-modal').on('hidden.bs.modal', e => {
    $('#audio-modal #current-audio')[0].pause()
  })

  $('#edit-video-privacy-button').click(OnEditVideoPrivacyButtonClick)

  $('#edit-image-privacy-button').click(OnEditImagePrivacyButtonClick)

  $('#edit-audio-privacy-button').click(OnEditAudioPrivacyButtonClick)

  $('#select-participant-to-insert-button').click(
    OnSelectParticipantButtonClick
  )
}
