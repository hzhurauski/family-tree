

// Выравнивание изображений
function ImageAlign() {
    var arr = Array(2);
    arr[0] = $(".person");
    arr[1] = $(".LittleTreePerson");

    for (var k = 0; k < arr.length; k++) {
        for (var i = 0; i < arr[k].length; i++) {
            if (arr[k][i].style.visibility != "hidden" && !$(arr[k][i]).find(".imgBlock")[0].classList.contains("hiddenPersonContent")) {
                //ChangeMarginPersonImage(arr[k][i].firstElementChild);
                ; // changed to fix images sliding
            }
        }
    }
}