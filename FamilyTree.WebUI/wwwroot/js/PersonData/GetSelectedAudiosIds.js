export function GetSelectedAudiosIds() {
    let result = [];

    $("#person-data-block")
        .find(".audios .audios__item")
        .each((i, el) => {
            if ($(el).find("input[type=\"checkbox\"]").is(":checked")) {
                result.push(el.getAttribute("data-id"));
            }
        });

    return result;
}