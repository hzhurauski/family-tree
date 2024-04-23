import { OnPrivacyLevelButtonClick } from "../Privacy/OnPrivacyLevelButtonClick.js";
import { OnLimitTypeButtonClick } from "../Privacy/OnLimitTypeButtonClick.js";
import { OnEditPrivacyLevelSubmitButtonClick } from "../Privacy/OnEditPrivacyLevelSubmitButtonClick.js";

//Events
export function InitPrivacyModalButonEvents() {
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