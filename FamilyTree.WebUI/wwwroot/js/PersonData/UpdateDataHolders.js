import { AddItemToDataHolders } from "./AddItemToDataHolders.js";
import { ClearDataHolders } from "./ClearDataHolders.js";
import { UpdateDataHolderOrder } from "./UpdateDataHolderOrder.js";

export function UpdateDataHolders() {
    ClearDataHolders();

    if (window.g_currentDataBlock == null)
        return;

    window.g_currentDataBlock
        .DataHolders
        .forEach((item) => {
            AddItemToDataHolders(item);
        });

    new window.Sortable($(".person-data-block__data-holders")[0], {
        handle: ".data-holder__selector, .data-holder-gender__selector, .data-holder-textarea__selector",
        animation: 500,
        onEnd: (event) => {
            let dataHolder = {
                Id: $(event.item).attr("data-id"),
                Order: event.newIndex + 1
            };

            UpdateDataHolderOrder(dataHolder);
        }
    });
}