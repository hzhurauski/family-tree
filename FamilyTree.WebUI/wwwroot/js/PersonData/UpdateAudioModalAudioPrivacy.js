import { SetPrivacyElementPrivacyLevel } from "./SetPrivacyElementPrivacyLevel.js";

export function UpdateAudioModalAudioPrivacy() {
    let audioModal = $("#audio-modal");
    let currentAudio = g_currentDataBlockAudios
        .find((item) => item.Id == g_openedAudioId);

    if (currentAudio == null)
        return;

    let privacyElement = audioModal.find(".privacy .privacy__privacy-level")[0];
    SetPrivacyElementPrivacyLevel(privacyElement, currentAudio.Privacy.PrivacyLevel);
}