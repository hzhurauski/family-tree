import { IsViewDataBlockAsParticipant } from "./IsViewDataBlockAsParticipant.js";

export function ShowSaveButton(isShow = true) {    
    let saveButton = $("#save-elements-button");

    saveButton.css("display", isShow ? "block" : "none");

    if (IsViewDataBlockAsParticipant()) {
        saveButton.find(".btn__text")[0].innerHTML = "Сохранить копию у участника";
    }
    else {
        saveButton.find(".btn__text")[0].innerHTML = "Сохранить";
    }
}