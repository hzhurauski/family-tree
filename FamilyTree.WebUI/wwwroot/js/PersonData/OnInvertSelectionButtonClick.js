import { GetCurrentActionTypeElements } from "./GetCurrentActionTypeElements.js";
import { InverseSelectCheckboxes } from "./InverseSelectCheckboxes.js";

export function OnInvertSelectionButtonClick() {
    InverseSelectCheckboxes(GetCurrentActionTypeElements());
}