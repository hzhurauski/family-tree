export function ShowEditButton(isShow = true) {
    $("#person-data-block #edit-element-button")
        .css("display", isShow ? "inline-block" : "none");
}