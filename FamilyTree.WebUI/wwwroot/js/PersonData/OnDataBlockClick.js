import { RefreshDataBlock } from "./RefreshDataBlock.js";
import { ShowDataBlockButtons } from "./ShowDataBlockButtons.js";

export function OnDataBlockClick(event) {
    if ($(event.target).is("input")) return;

    let dataBlockId = $(event.currentTarget).attr("data-id");

    RefreshDataBlock(dataBlockId);

    ShowDataBlockButtons();
}