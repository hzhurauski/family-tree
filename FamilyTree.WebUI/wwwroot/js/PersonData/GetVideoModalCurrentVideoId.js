export function GetVideoModalCurrentVideoId() {
    return $("#video-modal .videos-list .videos-list__item_active")
        .attr("data-id");
}