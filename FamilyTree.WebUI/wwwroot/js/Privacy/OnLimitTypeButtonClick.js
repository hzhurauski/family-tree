function OnLimitTypeButtonClick(event) {
    let limitTypeValue = $(event.currentTarget)
        .find("input")
        .val();

    if (limitTypeValue == 0) {
        $("#privacy-level-modal")
            .find("#privacy-level-limits")
            .css("display", "none");
    }
    else {
        $("#privacy-level-modal")
            .find("#privacy-level-limits")
            .css("display", "block");
    }
}