import { CreateDateDataHolderElement } from "./CreateDateDataHolderElement.js";
import { CreateDateTimeDataHolderElement } from "./CreateDateTimeDataHolderElement.js";
import { CreateGenderDataHolderElement } from "./CreateGenderDataHolderElement.js";
import { CreateTextAreaDataHolderElement } from "./CreateTextAreaDataHolderElement.js";
import { CreateTextDataHolderElement } from "./CreateTextDataHolderElement.js";
import { CreateTimeDataHolderElement } from "./CreateTimeDataHolderElement.js";

export function AddItemToDataHolders(dataHolder) {
    let dataHolderElement = null;

    switch (dataHolder.DataHolderType) {
        case DataHolderTypes.Text : {
            dataHolderElement = CreateTextDataHolderElement(dataHolder);
            break;
        }        
        case DataHolderTypes.TextArea: {
            dataHolderElement = CreateTextAreaDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.Date : {
            dataHolderElement = CreateDateDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.DateTime : {
            dataHolderElement = CreateDateTimeDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.Time : {
            dataHolderElement = CreateTimeDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.Name: {
            dataHolderElement = CreateTextDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.Surname: {
            dataHolderElement = CreateTextDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.MiddleName: {
            dataHolderElement = CreateTextDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.Birthday: {
            dataHolderElement = CreateDateDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.Gender: {
            dataHolderElement = CreateGenderDataHolderElement(dataHolder);
            break;
        }
        default:
            return;
    }

    $("#person-data-block")
        .find(".data-holders")[0]
        .appendChild(dataHolderElement);

    if (dataHolder.DataHolderType == window.DataHolderTypes.Gender) {    
        switch (dataHolder.Data) {
            case window.GenderTypes.Male: {
                $(dataHolderElement).find("input[type=\"radio\"][value=\"Male\"]").prop("checked", true);
                break;
            }
            case window.GenderTypes.Female: {
                $(dataHolderElement).find("input[type=\"radio\"][value=\"Female\"]").prop("checked", true);
                break;
            }
            case window.GenderTypes.Unknown: {
                $(dataHolderElement).find("input[type=\"radio\"][value=\"Unknown\"]").prop("checked", true);
                break;
            }

            default:
                break;
        }
    }
}