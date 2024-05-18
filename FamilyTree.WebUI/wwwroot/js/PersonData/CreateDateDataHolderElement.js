import { CreateDataHolderDataElement } from "./CreateDataHolderDataElement.js";
import { CreateDataHolderElement } from "./CreateDataHolderElement.js";
import { CreateDataHolderPrivacyElement } from "./CreateDataHolderPrivacyElement.js";
import { CreateDataHolderSelectorElement } from "./CreateDataHolderSelectorElement.js";
import { CreateDataHolderTitleElement } from "./CreateDataHolderTitleElement.js";

export function CreateDateDataHolderElement(dataHolder) {
    let dataHolderElement = CreateDataHolderElement(dataHolder);

    let dataHolderDataElement = CreateDataHolderDataElement();
    let inputElement = document.createElement("input");
    inputElement.type = "date";

    inputElement.value = dataHolder.Data
        ? window.moment(dataHolder.Data, getFormat(dataHolder.Data))
            .format()
            .split('T')[0]
        : 0;

    dataHolderDataElement.appendChild(inputElement);

    dataHolderElement.appendChild(CreateDataHolderSelectorElement(dataHolder));
    dataHolderElement.appendChild(CreateDataHolderTitleElement(dataHolder));
    dataHolderElement.appendChild(dataHolderDataElement);
    dataHolderElement.appendChild(CreateDataHolderPrivacyElement(dataHolder));

    return dataHolderElement;

    function getFormat(d){
        const dateFormats = {
            "iso_int" : "YYYY-MM-DD",
            "short_date" : "DD/MM/YYYY",
            "iso_date_time": "YYYY-MM-DDTHH:MM:SS",
            "iso_date_time_utc": "YYYY-MM-DDTHH:MM:SSZ"
        }          
        for (var prop in dateFormats) {
              if(window.moment(d, dateFormats[prop],true).isValid()){
                 return dateFormats[prop];
              }
        }
        return null;
    }
}