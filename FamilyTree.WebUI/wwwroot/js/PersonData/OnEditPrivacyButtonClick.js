import { LoadPrivacyData } from "../Privacy/LoadPrivacyData.js";

export function OnEditPrivacyButtonClick() {  
    switch (window.g_currentAddButtonActionType) {
        case window.AddButtonActionTypes.AddDataHolder: {
            let selectedDataHolders = $("#person-data-block")
                .find(".data-holders")
                .find(".data-holders__item input[type=\"checkbox\"]:checked")
                .parents(".data-holders__item");
            
            if (selectedDataHolders.length == 0 ||
                selectedDataHolders.length > 1) return;

            let dataHolderId = selectedDataHolders.attr("data-id");
            let dataHolderPrivacy = window.g_currentDataBlock
                .DataHolders
                .find(dh => dh.Id == dataHolderId)
                .Privacy;

            window.g_editPrivacyId = dataHolderPrivacy.Id;

            LoadPrivacyData(dataHolderPrivacy);
            break;
        }
            
        default:
            return;
    }

    $("#privacy-level-modal").modal("show");
}