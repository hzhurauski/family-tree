export function ShowPrivacyButton(isShow = true) {
    $("#person-data-block #edit-privacy-button")
        .css("display", isShow ? "inline-block" : "none");
}
