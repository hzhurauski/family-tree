import { AddItemToAudios } from "./AddItemToAudios.js";
import { ClearAudios } from "./ClearAudios.js";
import { OnPlayAudioButtonClick } from "./OnPlayAudioButtonClick.js";

export function UpdateAudios() {
    ClearAudios();

    if (window.g_currentDataBlockAudios == null)
        return;

    window.g_currentDataBlockAudios
        .forEach((item) => {
            AddItemToAudios(item);
        });

    $("#person-data-block")
        .find(".audios .audios__item .audio__play")
        .click(OnPlayAudioButtonClick);
}
