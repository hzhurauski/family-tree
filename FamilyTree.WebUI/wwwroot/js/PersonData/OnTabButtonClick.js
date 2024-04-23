import { ShowDataBlockContentTab } from "./ShowDataBlockContentTab.js";
import { ShowEditButton } from "./ShowEditButton.js";
import { ShowPrivacyButton } from "./ShowPrivacyButton.js";
import { ShowSaveButton } from "./ShowSaveButton.js";

export function OnTabButtonClick(event) {
    let targetElement = $(event.currentTarget);

    let dataBlockContentTabsButtonsElement = $("#person-data-block")
        .find(".data-block-content")
        .find(".tabs-buttons");

    if (targetElement.hasClass("tab-button-data")) {
        ShowDataBlockContentTab(DataBlockContentTabs.Data);
        g_currentAddButtonActionType = AddButtonActionTypes.AddDataHolder;
        ShowSaveButton();
        ShowEditButton();
        ShowPrivacyButton();
    }
    else if (targetElement.hasClass("tab-button-images")) {
        ShowDataBlockContentTab(DataBlockContentTabs.Images);
        g_currentAddButtonActionType = AddButtonActionTypes.AddImage;
        ShowSaveButton(false);
        ShowEditButton(false);
        ShowPrivacyButton(false);
    }
    else if (targetElement.hasClass("tab-button-videos")) {
        ShowDataBlockContentTab(DataBlockContentTabs.Videos);
        g_currentAddButtonActionType = AddButtonActionTypes.AddVideo;
        ShowSaveButton(false);
        ShowEditButton(false);
        ShowPrivacyButton(false);
    }
    else if (targetElement.hasClass("tab-button-audios")) {
        ShowDataBlockContentTab(DataBlockContentTabs.Audios);
        g_currentAddButtonActionType = AddButtonActionTypes.AddAudio;
        ShowSaveButton(false);
        ShowEditButton(false);
        ShowPrivacyButton(false);
    }
    else if (targetElement.hasClass("tab-button-participants")){
        ShowDataBlockContentTab(DataBlockContentTabs.Participants);
        g_currentAddButtonActionType = AddButtonActionTypes.AddParticipant;
        ShowSaveButton(false);
        ShowEditButton(false);
        ShowPrivacyButton(false);
    }
    else {
        return;
    }

    dataBlockContentTabsButtonsElement
        .children()
        .removeClass("tabs-buttons__button_active");

    targetElement.addClass("tabs-buttons__button_active");
}