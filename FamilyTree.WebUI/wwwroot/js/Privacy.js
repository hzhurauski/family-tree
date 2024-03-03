$(window).load(() => {
    InitPrivacyModalButonEvents();
    InitPrivacyNotifications();
});

let g_privacyNotificationsConnection = null;
let g_editPrivacyId = null;

//Notifications
function InitPrivacyNotifications() {
    g_privacyNotificationsConnection = new signalR.HubConnectionBuilder()
        .withUrl("/Privacy/Notifications")
        .build();

    g_privacyNotificationsConnection.on("ReceivePrivacyChangedNotification", (privacyId) => {
        if (g_currentAddButtonActionType == AddButtonActionTypes.AddDataHolder) {
            let dataHolderIndex = g_currentDataBlock.DataHolders
                .findIndex((item) => item.Privacy.Id == privacyId);

            if (dataHolderIndex !== -1) {
                let dataHolderId = g_currentDataBlock.DataHolders[dataHolderIndex].Id;

                GetDataHolder(dataHolderId).then((result) => {
                    g_currentDataBlock.DataHolders[dataHolderIndex] = result;
                    UpdateDataHolders();
                }, (r) => console.error(r));
            }
        }
        else if ($("#image-carousel-modal").hasClass("in")) {
            RefreshImages().then((result) => {
                UpdateImageSliderImagePrivacy();
            });
        }
        else if ($("#video-modal").hasClass("in")) {
            RefreshVideos().then((result) => {
                UpdateVideoModalVideoPrivacy();
            });
        }
        else if ($("#audio-modal").hasClass("in")) {
            RefreshAudios().then((result) => {
                UpdateAudioModalAudioPrivacy();
            });
        }
    });

    g_privacyNotificationsConnection.start()
        .catch(error => console.error(error.Message));
}

// Requests
async function UpdatePrivacy(privacy) {
    let result = await $.ajax({
        type: "PUT",
        data: privacy,
        url: "/Privacy/Update/" + privacy.Id
    });

    return result;
}

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

function OnEditPrivacyLevelSubmitButtonClick(event) {
    let editPrivacyModal = $("#privacy-level-modal");
    let privacy = GetPrivacyData();

    switch (g_currentAddButtonActionType) {
        case AddButtonActionTypes.AddDataHolder: {
            UpdatePrivacy(privacy).then((result) => {
                RefreshDataHolders();
                UpdateDataHolders();
                editPrivacyModal.modal("hide");
            }, (r) => {
                alert("Ошибка при изменении приватности ячейки данных.");
            });
            
            break;
        }

        case AddButtonActionTypes.AddImage: {
            UpdatePrivacy(privacy).then((result) => {
                RefreshImages().then((result) => {
                    UpdateImageSliderImagePrivacy();
                    editPrivacyModal.modal("hide");
                });
            }, (r) => {
                alert("Ошибка при изменении приватности изображения.");
            });
            
            break;
        }

        case AddButtonActionTypes.AddVideo: {
            UpdatePrivacy(privacy).then((result) => {
                RefreshVideos().then((result) => {
                    UpdateVideoModalVideoPrivacy();
                    editPrivacyModal.modal("hide");
                });
            }, (r) => {
                alert("Ошибка при изменении приватности видео.");
            });
            
            break;
        }

        case AddButtonActionTypes.AddAudio: {
            UpdatePrivacy(privacy).then((result) => {
                RefreshAudios().then((result) => {
                    UpdateAudioModalAudioPrivacy();
                    editPrivacyModal.modal("hide");
                });                
            }, (r) => {
                alert("Ошибка при изменении приватности аудио.");
            });

            break;
        }

        default:
            break;
    }
}

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