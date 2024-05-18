import { AddImageToSlider } from "./AddImageToSlider.js";
import { ClearSliderImages } from "./ClearSliderImages.js";
import { OnSliderArrowClick } from "./OnSliderArrowClick.js";
import { UpdateSliderImageDetails } from "./UpdateSliderImageDetails.js";

export function UpdateImageSlider(imageId) {
    let slider = $("#image-carousel-modal")
        .find(".slider");

    if (slider.hasClass("slick-initialized")) {
        slider.slick("unslick");
        ClearSliderImages();
    }        

    if (window.g_currentDataBlockImages == null)
        return;

    window.g_currentDataBlockImages
        .forEach((item) => {
            AddImageToSlider(item);
        });

    let initialSlide = 0;

    let selectedImage = window.g_currentDataBlockImages
        .find(item => item.Id == imageId);

    initialSlide = window.g_currentDataBlockImages.indexOf(selectedImage);

    slider.slick({
        slidesToScroll: 1,
        slidesToShow: 1,
        draggable: false,
        arrows: true,
        variableWidth: true
    });

    slider
        .find(".slick-arrow")
        .click(OnSliderArrowClick);    

    slider.slick("slickGoTo", initialSlide, false);

    UpdateSliderImageDetails(imageId);
}