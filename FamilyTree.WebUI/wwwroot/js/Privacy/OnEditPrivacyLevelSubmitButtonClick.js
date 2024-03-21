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