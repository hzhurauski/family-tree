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