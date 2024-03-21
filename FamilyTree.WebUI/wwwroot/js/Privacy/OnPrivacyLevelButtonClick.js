function OnPrivacyLevelButtonClick(event) {
    let privacyLevelValue = $(event.currentTarget)
        .find("input")
        .val();

    if (privacyLevelValue == PrivacyLevels.InternalUse) {
        $("#privacy-level-modal")
            .find("#privacy-level-accounts")
            .css("display", "block");
    }
    else {
        $("#privacy-level-modal")
            .find("#privacy-level-accounts")
            .css("display", "none");
    }
}