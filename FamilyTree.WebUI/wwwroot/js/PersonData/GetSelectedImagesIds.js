export function GetSelectedImagesIds() {
    let result = [];

    $("#person-data-block")
        .find(".images .images__item")
        .each((i, el) => {
            if ($(el).find("input[type=\"checkbox\"]").is(":checked")) {
                result.push(el.getAttribute("data-id"));
            }
        });

    return result;
}