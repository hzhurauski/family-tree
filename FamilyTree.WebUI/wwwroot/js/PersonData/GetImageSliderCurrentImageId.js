export function GetImageSliderCurrentImageId() {
    return $("#image-carousel-modal")
        .find(".slider .slick-current")
        .attr("data-id");
}