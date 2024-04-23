export async function CreateVideo(video) {
    const result = await $.ajax({
        type: "POST",
        data: video,
        cache: false,
        contentType: false,
        processData: false,
        url: "/Media/Video/Create",
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener("progress", function (e) {
                    if (e.lengthComputable) {
                        $("#add-video-modal #video-upload-progress")
                            .attr({
                                value: e.loaded,
                                max: e.total
                            });
                    }
                }, false);
            }
            return myXhr;
        }
    });

    return result;
}