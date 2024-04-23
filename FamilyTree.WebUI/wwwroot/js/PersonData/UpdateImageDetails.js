export function UpdateImageDetails(image) {
    let result = false;

    $.ajax({
        async: false,
        type: "PUT",
        data: image,
        url: "/Media/Image/UpdateDetails/" + image.Id,
        success: function (response) {
            result = true;
        }
    });

    return result;
}