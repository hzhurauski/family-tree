

function ChangeViewPerson(person, LittleTree) {
    $(person).attr("data-toggle", "");
    $(person).attr("data-target", "");
    if (LittleTree) {
        $(person).removeClass("LittleTreePerson");
    } else {
        $(person).removeClass("person");
    }
    $(person).addClass("newPerson");
    for (var i = 0; i < person.childNodes.length; i++) {
        $(person.childNodes[i]).addClass("hiddenPersonContent");
    }
    if (person.lastElementChild.tagName != "IMG") {
        var img = document.createElement('img');
        img.src = $("#blood-newBrother")[0].firstElementChild.src;
        person.appendChild(img);
    }
    else {
        $(person.lastElementChild).removeClass("hiddenPersonContent");
    }
}