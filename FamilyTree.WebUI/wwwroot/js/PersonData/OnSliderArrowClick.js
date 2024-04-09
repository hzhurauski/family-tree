import { UpdateSliderImageDetails } from "./UpdateSliderImageDetails.js";

export function OnSliderArrowClick() {
    let slider = $("#image-carousel-modal")
        .find(".slider");

    let imageId = slider
        .find(".slick-active")
        .attr("data-id");

    UpdateSliderImageDetails(imageId);
}