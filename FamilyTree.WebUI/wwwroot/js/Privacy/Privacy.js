$(window).load(() => {
    InitPrivacyModalButonEvents();
    InitPrivacyNotifications();
});

let g_privacyNotificationsConnection = null;
let g_editPrivacyId = null;

function GetPrivacyData() {
    let editPrivacyModal = $("#privacy-level-modal");
    let beginDate = editPrivacyModal.find("#privacy-level-begin-date").val();
    let endDate = editPrivacyModal.find("#privacy-level-end-date").val();
    let isAlways = editPrivacyModal.find("input[name=\"limit-type\"]:checked").val() == "0";
    let privacyLevel = editPrivacyModal.find("input[name=\"privacy-level\"]:checked").val();

    let privacy = {
        Id: g_editPrivacyId,
        PrivacyLevel: privacyLevel,
        BeginDate: beginDate,
        EndDate: endDate,
        IsAlways: isAlways
    };

    return privacy;
}

function UTCDateToLocaleString(date) {
    var newDate = new Date(
        Date.UTC(date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()));

    let newDateISOStr = newDate.toISOString();

    return newDateISOStr.substring(0, newDateISOStr.lastIndexOf(":"));
}