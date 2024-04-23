export function AddItemToVideos(video) {
    let videoElement = document.createElement("div");
    videoElement.classList.add("video");
    videoElement.classList.add("videos__item");
    videoElement.setAttribute("data-id", video.Id);

    let selectorElement = document.createElement("div");
    selectorElement.classList.add("video__selector");

    let checkboxElement = document.createElement("div");
    checkboxElement.classList.add("checkbox");

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";

    checkboxElement.appendChild(inputElement);
    selectorElement.appendChild(checkboxElement);

    let imgElement = document.createElement("img");
    imgElement.src = "data:image/" + video.PreviewImageType + ";base64," + video.PreviewImageData;

    videoElement.appendChild(selectorElement);
    videoElement.appendChild(imgElement);

    $("#person-data-block")
        .find(".videos")[0]
        .appendChild(videoElement);
}