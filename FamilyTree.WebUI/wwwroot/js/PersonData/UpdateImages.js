import { AddItemToImages } from "./AddItemToImages.js";
import { ClearImages } from "./ClearImages.js";
import { OnImageClick } from "./OnImageClick.js";

export function UpdateImages() {
    ClearImages();

    if (g_currentDataBlockImages == null)
        return;

    g_currentDataBlockImages
        .forEach((item) => {
            AddItemToImages(item);
        });

    $("#person-data-block")
        .find(".images .images__item")
        .click(OnImageClick);
}