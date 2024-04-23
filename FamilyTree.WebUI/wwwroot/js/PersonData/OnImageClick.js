import { UpdateImageSlider } from "./UpdateImageSlider.js";

export function OnImageClick(event) {
    if ($(event.target).is("input")) return;

    let imageId = $(event.currentTarget).attr("data-id");

    UpdateImageSlider(imageId);

    $("#image-carousel-modal").modal("show");
}