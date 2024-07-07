import { DeselectAllCheckboxes } from './DeselectAllCheckboxes.js'
import { GetCurrentActionTypeElements } from './GetCurrentActionTypeElements.js'

export function OnDeselectAllButtonClick() {
  DeselectAllCheckboxes(GetCurrentActionTypeElements())
}
