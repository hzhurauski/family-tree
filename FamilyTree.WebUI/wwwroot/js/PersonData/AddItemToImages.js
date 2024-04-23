export function AddItemToImages(image) {
    let imageElement = document.createElement("div");
    imageElement.classList.add("image");
    imageElement.classList.add("images__item");
    imageElement.setAttribute("data-id", image.Id);

    let selectorElement = document.createElement("div");
    selectorElement.classList.add("image__selector");

    let checkboxElement = document.createElement("div");
    checkboxElement.classList.add("checkbox");

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";

    checkboxElement.appendChild(inputElement);
    selectorElement.appendChild(checkboxElement);

    let imgElement = document.createElement("img");
    imgElement.src = "/Media/Image/GetFile/" + image.Id;
    imgElement.decoding = "async";

    imageElement.appendChild(selectorElement);
    imageElement.appendChild(imgElement);

    $("#person-data-block")
        .find(".images")[0]
        .appendChild(imageElement);
}