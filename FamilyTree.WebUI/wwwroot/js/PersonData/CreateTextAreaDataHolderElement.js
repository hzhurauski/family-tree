import { CreateDataHolderDataElement } from "./CreateDataHolderDataElement.js";
import { CreateDataHolderElement } from "./CreateDataHolderElement.js";
import { CreateDataHolderPrivacyElement } from "./CreateDataHolderPrivacyElement.js";
import { CreateDataHolderSelectorElement } from "./CreateDataHolderSelectorElement.js";
import { CreateDataHolderTitleElement } from "./CreateDataHolderTitleElement.js";

export function CreateTextAreaDataHolderElement(dataHolder) {
    let dataHolderElement = CreateDataHolderElement(dataHolder);
    dataHolderElement.classList.replace("data-holder", "data-holder-textarea");

    let dataHolderSelectorElement = CreateDataHolderSelectorElement(dataHolder);
    dataHolderSelectorElement.classList.replace("data-holder__selector", "data-holder-textarea__selector");

    let dataHolderTitleElement = CreateDataHolderTitleElement(dataHolder);
    dataHolderTitleElement.classList.replace("data-holder__title", "data-holder-textarea__title");

    let dataHolderDataElement = CreateDataHolderDataElement();
    dataHolderDataElement.classList.replace("data-holder__data", "data-holder-textarea__data");

    let textAreaElement = document.createElement("textarea");
    textAreaElement.value = dataHolder.Data;
    textAreaElement.setAttribute("rows", "6");
    dataHolderDataElement.appendChild(textAreaElement);

    let dataHolderPrivacyElement = CreateDataHolderPrivacyElement(dataHolder);
    dataHolderPrivacyElement.classList.replace("data-holder__privacy", "data-holder-textarea__privacy");

    dataHolderElement.appendChild(dataHolderSelectorElement);
    dataHolderElement.appendChild(dataHolderTitleElement);
    dataHolderElement.appendChild(dataHolderPrivacyElement);
    dataHolderElement.appendChild(dataHolderDataElement);

    return dataHolderElement;
}