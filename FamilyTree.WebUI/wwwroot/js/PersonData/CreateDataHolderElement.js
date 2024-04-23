export function CreateDataHolderElement(dataHolder) {
    let dataHolderElement = document.createElement("div");
    dataHolderElement.classList.add("data-holders__item");
    dataHolderElement.classList.add("data-holder");
    dataHolderElement.setAttribute("data-id", dataHolder.Id);
    return dataHolderElement;
}