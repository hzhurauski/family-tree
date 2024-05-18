import { LoadPrivacyData } from "../Privacy/LoadPrivacyData.js";
import { SetPrivacyElementPrivacyLevel } from "./SetPrivacyElementPrivacyLevel.js";

export function UpdateAudioModal(audioId) {
    let audioModal = $("#audio-modal");
    let currentAudioElement = audioModal.find("#current-audio")[0];

    let currentAudio = window.g_currentDataBlockAudios
        .find((item) => item.Id == audioId);

    audioModal.find("#current-audio-title").val(currentAudio.Title);
    audioModal.find("#current-audio-desc").val(currentAudio.Description);

    currentAudioElement.src = "Media/Audio/GetFile/" + audioId;
    currentAudioElement.volume = 0.1;

    let privacyElement = audioModal.find(".privacy .privacy__privacy-level")[0];
    SetPrivacyElementPrivacyLevel(privacyElement, currentAudio.Privacy.PrivacyLevel);
    window.g_editPrivacyId = currentAudio.Privacy.Id;
    LoadPrivacyData(currentAudio.Privacy);
}