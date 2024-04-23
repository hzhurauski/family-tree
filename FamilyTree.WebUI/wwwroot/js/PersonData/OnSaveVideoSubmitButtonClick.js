import { GetVideoModalCurrentVideoId } from "./GetVideoModalCurrentVideoId.js";
import { RefreshVideos } from "./RefreshVideos.js";
import { SelectVideoModalVideo } from "./SelectVideoModalVideo.js";
import { UpdateVideoDetails } from "./UpdateVideoDetails.js";
import { UpdateVideoModalVideos } from "./UpdateVideoModalVideos.js";

export function OnSaveVideoSubmitButtonClick() {
    let currentVideoId = GetVideoModalCurrentVideoId();
    let videoModal = $("#video-modal");

    let video = {
        Id: currentVideoId,
        Title: videoModal.find("#current-video-title").val(),
        Description: videoModal.find("#current-video-desc").val()
    };

    if (!UpdateVideoDetails(video)) {
        alert("Ошибка при сохранении данных видео.");
    }
    else {
        RefreshVideos().then((val) => {
            UpdateVideoModalVideos();
            SelectVideoModalVideo(currentVideoId);
        });
    }
}