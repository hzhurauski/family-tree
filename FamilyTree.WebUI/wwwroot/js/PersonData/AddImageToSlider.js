export function AddImageToSlider(image) {
    let slider = $("#image-carousel-modal")
        .find(".slider")[0];

    let imgElement = document.createElement("img");
    imgElement.src = "/Media/Image/GetFile/" + image.Id;
    imgElement.decoding = "async";
    imgElement.setAttribute("data-id", image.Id);

    slider.appendChild(imgElement);
}