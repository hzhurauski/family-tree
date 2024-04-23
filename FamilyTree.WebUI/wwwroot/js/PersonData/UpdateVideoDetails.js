export function UpdateVideoDetails(video) {
    let result = false;

    $.ajax({
        async: false,
        type: "PUT",
        data: video,
        url: "/Media/Video/UpdateDetails/" + video.Id,
        success: function (response) {
            result = true;
        }
    });

    return result;
}