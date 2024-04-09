export function GetSelectedParticipantIds() {
    let result = [];

    $("#person-data-block")
        .find(".participants .participants__item")
        .each((i, el) => {
            if ($(el).find("input[type=\"checkbox\"]").is(":checked")) {
                result.push(parseInt(el.getAttribute("data-id")));
            }
        });

    return result;
}