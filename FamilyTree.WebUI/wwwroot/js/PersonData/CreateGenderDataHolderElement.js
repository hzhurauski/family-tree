import { CreateDataHolderDataElement } from "./CreateDataHolderDataElement.js";
import { CreateDataHolderElement } from "./CreateDataHolderElement.js";
import { CreateDataHolderPrivacyElement } from "./CreateDataHolderPrivacyElement.js";
import { CreateDataHolderSelectorElement } from "./CreateDataHolderSelectorElement.js";
import { CreateDataHolderTitleElement } from "./CreateDataHolderTitleElement.js";

export function CreateGenderDataHolderElement(dataHolder) {
    let dataHolderElement = CreateDataHolderElement(dataHolder);
    dataHolderElement.classList.replace("data-holder", "data-holder-gender");

    let dataHolderSelectorElement = CreateDataHolderSelectorElement(dataHolder);
    dataHolderSelectorElement.classList.replace("data-holder__selector", "data-holder-gender__selector");

    let dataHolderTitleElement = CreateDataHolderTitleElement(dataHolder);
    dataHolderTitleElement.classList.replace("data-holder__title", "data-holder-gender__title");

    let dataHolderDataElement = CreateDataHolderDataElement();
    dataHolderDataElement.classList.replace("data-holder__data", "data-holder-gender__data");

    let buttonGroupElement = document.createElement("div");
    buttonGroupElement.classList.add("btn-group");
    buttonGroupElement.classList.add("btn-group-toggle");
    buttonGroupElement.setAttribute("data-toggle", "buttons");

    let labelsElements = [];
    labelsElements.push(document.createElement("label"));
    labelsElements.push(document.createElement("label"));
    labelsElements.push(document.createElement("label"));

    $(labelsElements).addClass("btn").addClass("btn-default");

    let inputElements = [];
    inputElements.push(document.createElement("input"));
    inputElements.push(document.createElement("input"));
    inputElements.push(document.createElement("input"));

    inputElements[0].type = "radio";
    inputElements[0].name = "person-gender";
    inputElements[0].value = "Male";

    inputElements[1].type = "radio";
    inputElements[1].name = "person-gender";
    inputElements[1].value = "Female";

    inputElements[2].type = "radio";
    inputElements[2].name = "person-gender";
    inputElements[2].value = "Unknown";

    labelsElements[0].appendChild(inputElements[0]);
    labelsElements[0].innerHTML += "Мужчина";
    labelsElements[1].appendChild(inputElements[1]);
    labelsElements[1].innerHTML += "Женщина";
    labelsElements[2].appendChild(inputElements[2]);
    labelsElements[2].innerHTML += "Неизвестно";

    buttonGroupElement.appendChild(labelsElements[0]);
    buttonGroupElement.appendChild(labelsElements[1]);
    buttonGroupElement.appendChild(labelsElements[2]);

    dataHolderDataElement.appendChild(buttonGroupElement);

    let dataHolderPrivacyElement = CreateDataHolderPrivacyElement(dataHolder);
    dataHolderPrivacyElement.classList.replace("data-holder__privacy", "data-holder-gender__privacy");

    dataHolderElement.appendChild(dataHolderSelectorElement);
    dataHolderElement.appendChild(dataHolderTitleElement);
    dataHolderElement.appendChild(dataHolderDataElement);
    dataHolderElement.appendChild(dataHolderPrivacyElement);

    switch (dataHolder.Data) {
        case GenderTypes.Male: {
            labelsElements[0].classList.add("active");
            break;
        }
        case GenderTypes.Female: {
            labelsElements[1].classList.add("active");
            break;
        }
        case GenderTypes.Unknown: {
            labelsElements[2].classList.add("active");
            break;
        }

        default:
            break;
    }

    return dataHolderElement;
}