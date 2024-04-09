import { GetVideoModalCurrentVideoId } from "./GetVideoModalCurrentVideoId.js";
import { SetPrivacyElementPrivacyLevel } from "./SetPrivacyElementPrivacyLevel.js";

export function UpdateVideoModalVideoPrivacy() {
    let videoModal = $("#video-modal");
    let currentVideo = g_currentDataBlockVideos
        .find((item) => item.Id == GetVideoModalCurrentVideoId());

    if (currentVideo == null)
        return;

    let privacyElement = videoModal.find(".privacy .privacy__privacy-level")[0];
    SetPrivacyElementPrivacyLevel(privacyElement, currentVideo.Privacy.PrivacyLevel);
}
