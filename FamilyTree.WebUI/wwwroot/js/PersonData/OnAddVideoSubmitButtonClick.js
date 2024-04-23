import { CreateVideo } from "./CreateVideo.js";
import { RefreshVideos } from "./RefreshVideos.js";
import { UpdateVideos } from "./UpdateVideos.js";

export function OnAddVideoSubmitButtonClick() {
    if (window.g_isUploadingVideo) return;

    let videoModal = $("#add-video-modal");

    let files = videoModal.find("#video-file")[0].files;

    if (files.length == 0) {
        alert("Пожалуйста выберите файл.");
        return;
    }

    let formData = new FormData();
    formData.append("DataBlockId", window.g_currentDataBlock.Id);
    formData.append("Title", videoModal.find("#video-title").val());
    formData.append("Description", videoModal.find("#video-desc").val());
    formData.append("VideoFile", files[0]);

    window.g_isUploadingVideo = true;
    videoModal.find("#video-file").prop("disabled", true);

    CreateVideo(formData).then(
        (data) => {
            videoModal.modal("hide");
            RefreshVideos().then((val) => UpdateVideos());
            window.g_isUploadingVideo = false;
            videoModal.find("#video-file").prop("disabled", false);
        },
        (r) => {
            alert("Ошибка при создании видео.");
            window.g_isUploadingVideo = false;
            videoModal.find("#video-file").prop("disabled", false);
        });
}