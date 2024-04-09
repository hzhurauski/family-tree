export function GetSelectedVideosIds() {
    let result = [];

    $("#person-data-block")
        .find(".videos .videos__item")
        .each((i, el) => {
            if ($(el).find("input[type=\"checkbox\"]").is(":checked")) {
                result.push(el.getAttribute("data-id"));
            }
        });

    return result;
}
