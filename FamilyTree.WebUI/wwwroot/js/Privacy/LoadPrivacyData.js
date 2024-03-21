//UI
function LoadPrivacyData(privacy) {
    let privacyModal = $("#privacy-level-modal");

    if (privacy == null) {
        privacyModal
            .find(".privacy-confidential")
            .click();

        privacyModal
            .find("input[name=\"limit-type\"][value=\"0\"]")
            .parent()
            .click();
    }
    else {
        privacyModal
            .find("input[name=\"privacy-level\"][value=\"" + privacy.PrivacyLevel + "\"]")
            .parent()
            .click();

        privacyModal
            .find("input[name=\"privacy-level\"][value=\"" + privacy.PrivacyLevel + "\"]")
            .prop("checked", true);

        if (privacy.IsAlways) {
            privacyModal
                .find("input[name=\"limit-type\"][value=\"0\"]")
                .parent()
                .click();

            privacyModal
                .find("input[name=\"limit-type\"][value=\"0\"]")
                .prop("checked", true);
        }
        else {
            privacyModal
                .find("input[name=\"limit-type\"][value=\"1\"]")
                .parent()
                .click();

            privacyModal
                .find("input[name=\"limit-type\"][value=\"1\"]")
                .prop("checked", true);
        }

        let beginDate = UTCDateToLocaleString(new Date(privacy.BeginDate.replace("T", " ") + " UTC"));               
        let endDate = UTCDateToLocaleString(new Date(privacy.EndDate.replace("T", " ") + " UTC"));
        privacyModal
            .find("#privacy-level-begin-date")
            .val(beginDate);

        privacyModal
            .find("#privacy-level-end-date")
            .val(endDate);
    }
}