export async function DeleteVideo(videoId) {
    let result = await $.ajax({
        type: "DELETE",
        url: "/Media/Video/Delete/" + videoId
    });

    return result;
}