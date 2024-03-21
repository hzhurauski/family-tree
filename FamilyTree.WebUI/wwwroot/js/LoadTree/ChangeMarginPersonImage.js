

// изменение отступа для изображения
function ChangeMarginPersonImage(imgCard) {

    var img = imgCard.firstElementChild;
    var intMarginHeight = Math.round((imgCard.offsetHeight - img.height) / 2 - 1);
    var intMarginWidth = Math.round((imgCard.offsetWidth - img.width) / 2 - 1);
    if (intMarginWidth < 0)
        intMarginWidth = 0;
    if (intMarginHeight < 0)
        intMarginHeight = 0;
    img.style.margin = intMarginHeight.toString() + "px " + intMarginWidth.toString() + "px";
}