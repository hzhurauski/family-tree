import { PasteAudios } from "./PasteAudios.js";
import { PasteDataBlocks } from "./PasteDataBlocks.js";
import { PasteDataHolders } from "./PasteDataHolders.js";
import { PasteImages } from "./PasteImages.js";
import { PasteVideos } from "./PasteVideos.js";

export function OnPasteButtonClick() {
    switch (g_currentAddButtonActionType) {
        case AddButtonActionTypes.AddDataBlock: {
            PasteDataBlocks();
            break;
        }
        case AddButtonActionTypes.AddDataHolder: {
            PasteDataHolders();
            break;
        }
        case AddButtonActionTypes.AddImage: {
            PasteImages();
            break;
        }
        case AddButtonActionTypes.AddVideo: {
            PasteVideos();
            break;
        }
        case AddButtonActionTypes.AddAudio: {
            PasteAudios();
            break;
        }

        default:
            break;
    }
}