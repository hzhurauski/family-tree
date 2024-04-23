export async function CreateImage(image) {
    let result = await $.ajax({
        type: "POST",
        data: image,
        contentType: false,
        processData: false,
        url: "/Media/Image/Create",
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener("progress", function (e) {
                    if (e.lengthComputable) {
                        $("#add-image-modal #image-upload-progress")
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