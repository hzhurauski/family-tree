import { IsViewDataBlockAsParticipant } from "./IsViewDataBlockAsParticipant.js";
import { SaveCopiedDataAsParticipant } from "./SaveCopiedDataAsParticipant.js";
import { SaveData } from "./SaveData.js";

export function OnSaveButtonClick() {
    if (window.g_isSaving) return;
    if ($("#person-data-block").find(".data-holders .data-holders__item").length === 0) return;
    window.g_isSaving = true;

    IsViewDataBlockAsParticipant() ? SaveCopiedDataAsParticipant() : SaveData();
}