export async function CreateAudio(audio) {
    const result = await $.ajax({
        type: "POST",
        data: audio,
        cache: false,
        contentType: false,
        processData: false,
        url: "/Media/Audio/Create",
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener("progress", function (e) {
                    if (e.lengthComputable) {
                        $("#add-audio-modal #audio-upload-progress")
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