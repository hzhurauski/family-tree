import { AddItemToDataHolders } from "./AddItemToDataHolders.js";
import { ClearDataHolders } from "./ClearDataHolders.js";
import { UpdateDataHolderOrder } from "./UpdateDataHolderOrder.js";

export function UpdateDataHolders() {
    ClearDataHolders();

    if (g_currentDataBlock == null)
        return;

    g_currentDataBlock
        .DataHolders
        .forEach((item) => {
            AddItemToDataHolders(item);
        });

    new Sortable($(".person-data-block__data-holders")[0], {
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