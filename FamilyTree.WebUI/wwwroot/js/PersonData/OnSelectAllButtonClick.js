import { GetCurrentActionTypeElements } from './GetCurrentActionTypeElements.js'
import { SelectAllCheckboxes } from './SelectAllCheckboxes.js'

export function OnSelectAllButtonClick() {
  SelectAllCheckboxes(GetCurrentActionTypeElements())
}
