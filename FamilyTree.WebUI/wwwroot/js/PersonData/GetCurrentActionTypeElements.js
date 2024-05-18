export function GetCurrentActionTypeElements() {
    let elements = null;
    let personDataBlock = $("#person-data-block");
    switch (window.g_currentAddButtonActionType) {
        case window.AddButtonActionTypes.AddDataBlock: {
            elements = personDataBlock.find(".data-blocks .data-blocks__item");
            break;
        }
        case window.AddButtonActionTypes.AddDataHolder: {
            elements = personDataBlock.find(".data-holders .data-holders__item");
            break;
        }
        case window.AddButtonActionTypes.AddImage: {
            elements = personDataBlock.find(".images .images__item");
            break;
        }
        case window.AddButtonActionTypes.AddVideo: {
            elements = personDataBlock.find(".videos .videos__item");
            break;
        }
        case window.AddButtonActionTypes.AddAudio: {
            elements = personDataBlock.find(".audios .audios__item");
            break;
        }
        case window.AddButtonActionTypes.AddParticipant: {
            elements = personDataBlock.find(".participants .participants__item");
            break;
        }

        default:
            return;
    }

    return elements;
}