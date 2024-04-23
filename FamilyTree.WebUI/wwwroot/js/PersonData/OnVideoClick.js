import { UpdateVideoModalVideos } from "./UpdateVideoModalVideos.js";

export function OnVideoClick(event) {
    if ($(event.target).is("input")) return;

    let videoId = $(event.currentTarget).attr("data-id");

    UpdateVideoModalVideos();

    $("#video-modal .videos-list .videos-list__item[data-id=\"" + videoId + "\"]")
        .click();

    $("#video-modal").modal("show");
}