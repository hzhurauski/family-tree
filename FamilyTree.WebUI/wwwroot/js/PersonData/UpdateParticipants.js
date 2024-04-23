import { AddItemToParticipant } from "./AddItemToParticipant.js";
import { ClearParticipants } from "./ClearParticipants.js";
import { OnPartClick } from "./OnPartClick.js";

export function UpdateParticipants() {
    ClearParticipants();

    if (g_currentDataBlockParticipants == null)
        return;

        g_currentDataBlockParticipants
        .forEach((item) => {
            AddItemToParticipant(item);
        });

    $("#person-data-block")
        .find(".participants .participants__item")
        .click(OnPartClick);
}