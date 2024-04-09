import { CreateDataHolderDataElement } from "./CreateDataHolderDataElement.js";
import { CreateDataHolderElement } from "./CreateDataHolderElement.js";
import { CreateDataHolderPrivacyElement } from "./CreateDataHolderPrivacyElement.js";
import { CreateDataHolderSelectorElement } from "./CreateDataHolderSelectorElement.js";
import { CreateDataHolderTitleElement } from "./CreateDataHolderTitleElement.js";

export function CreateTextDataHolderElement(dataHolder) {
    let dataHolderElement = CreateDataHolderElement(dataHolder);  

    let dataHolderDataElement = CreateDataHolderDataElement();
    let inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = dataHolder.Data;
    dataHolderDataElement.appendChild(inputElement);

    dataHolderElement.appendChild(CreateDataHolderSelectorElement(dataHolder));
    dataHolderElement.appendChild(CreateDataHolderTitleElement(dataHolder));
    dataHolderElement.appendChild(dataHolderDataElement);
    dataHolderElement.appendChild(CreateDataHolderPrivacyElement(dataHolder));

    return dataHolderElement;
}