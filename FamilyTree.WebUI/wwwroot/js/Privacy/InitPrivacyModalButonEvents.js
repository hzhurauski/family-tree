//Events
function InitPrivacyModalButonEvents() {
    $("#privacy-level-modal")
        .find("input[name=\"privacy-level\"]")
        .parent()
        .click(OnPrivacyLevelButtonClick);

    $("#privacy-level-modal")
        .find("input[name=\"limit-type\"]")
        .parent()
        .click(OnLimitTypeButtonClick);

    $("#privacy-level-modal")
        .find("#edit-privacy-level-submit-button")
        .click(OnEditPrivacyLevelSubmitButtonClick);
}