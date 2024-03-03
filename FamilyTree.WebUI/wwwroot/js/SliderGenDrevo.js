var itemSize = 200;
var itemMargin = 30;
var space = itemSize + itemMargin;
var SliderBlock;
var LengthSlider = 2;

$(".NextItem").click(function (event) {
    NextItem(event.currentTarget);
});

$(".PrevItem").click(function (event) {    
    PrevItem(event.currentTarget);
});

function NextItem(currentTarget) {
    GetSpace(currentTarget);

    var current = $(SliderBlock)[0].getElementsByClassName("itemCurrent")[0];
    var List = $(SliderBlock)[0].getElementsByClassName("ListSlider")[0];
    var nextItem = current.nextElementSibling;

    if (nextItem == null) {
        nextItem = List.firstElementChild;
    }

    $(nextItem).removeClass("itemBefore");
    $(nextItem).removeClass("itemAfter");
    $(nextItem).addClass("itemAfter");

    var AfterNextItem;

    if (nextItem.nextElementSibling == null) {
        AfterNextItem = List.firstElementChild;
        $(AfterNextItem).removeClass("itemBefore");
        $(AfterNextItem).removeClass("itemAfter");
        $(AfterNextItem).addClass("itemAfter");
        $(AfterNextItem)[0].style.left = (GetNumber(nextItem.style.left) + space) + "px";
    }
    else {
        AfterNextItem = nextItem.nextElementSibling;
        $(AfterNextItem).removeClass("itemBefore");
        $(AfterNextItem).removeClass("itemAfter");
        $(AfterNextItem).addClass("itemAfter");
        $(AfterNextItem)[0].style.left = (GetNumber(nextItem.style.left) + space) + "px";
    }

    if (LengthSlider == 3) {
        var AfterAfterNextItem;

        if (AfterNextItem.nextElementSibling == null) {
            AfterAfterNextItem = List.firstElementChild;
            $(AfterAfterNextItem).removeClass("itemBefore");
            $(AfterAfterNextItem).removeClass("itemAfter");
            $(AfterAfterNextItem).addClass("itemAfter");
            $(AfterAfterNextItem)[0].style.left = (GetNumber(AfterNextItem.style.left) + space) + "px";
        }
        else {
            AfterAfterNextItem = AfterNextItem.nextElementSibling;
            $(AfterAfterNextItem).removeClass("itemBefore");
            $(AfterAfterNextItem).removeClass("itemAfter");
            $(AfterAfterNextItem).addClass("itemAfter");
            $(AfterAfterNextItem)[0].style.left = (GetNumber(AfterNextItem.style.left) + space) + "px";
        }
    }

    $(current).removeClass("itemCurrent");
    $(current).addClass("itemBefore");

    $(nextItem).removeClass("itemAfter");
    $(nextItem).addClass("itemCurrent");


    $(List)[0].style.transform = "translateX(" + (GetNumberListSlider($(List)[0].style.transform) - space) + "px)";

}
function PrevItem(currentTarget) {
    GetSpace(currentTarget);

    var current = $(SliderBlock)[0].getElementsByClassName("itemCurrent")[0];
    var prevItem = current.previousElementSibling;
    var List = $(SliderBlock)[0].getElementsByClassName("ListSlider")[0];

    if (prevItem == null) {
        prevItem = List.lastElementChild;
    }

    $(prevItem).removeClass("itemAfter");
    $(prevItem).removeClass("itemBefore");
    $(prevItem).addClass("itemBefore");
    $(prevItem)[0].style.left = (GetNumber(current.style.left) - space) + "px";

    $(current).removeClass("itemCurrent");
    $(current).addClass("itemAfter");

    $(prevItem).removeClass("itemBefore");
    $(prevItem).addClass("itemCurrent");


    $(List)[0].style.transform = "translateX(" + (GetNumberListSlider($(List)[0].style.transform) + space) + "px)";  
}

function GetNumber(left) {    
    var num = left.slice(0, left.length - 2);
    return num - 0;
}
function GetNumberListSlider(List) {
    var num = List.slice(11, List.length - 3);
    return num - 0;
}
function GetSpace(currentTarget)
{
    SliderBlock = $("#" + $(currentTarget.parentElement)[0].id + " .PrevItem")[0].nextElementSibling;
    LengthSlider = SliderBlock.firstElementChild.nextElementSibling.nextElementSibling.value - 0;
    var VitemSize = SliderBlock.firstElementChild;    
    var VitemMargin = VitemSize.nextElementSibling;
    space = (VitemSize.value - 0) + (VitemMargin.value - 0);    
}
