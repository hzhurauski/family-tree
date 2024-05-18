import { DrawConnections } from "./Draw.js";
import { DrawBlood } from "./DrawBlood.js";
import { DrawConntecionsLittleTree } from "./DrawConntecionsLittleTree.js";
import { FillTree } from "./FillTree.js";
import { ImageAlign } from "./ImageAlign.js";
import { InitFamilyTreeEvents } from "./InitFamilyTreeEvents.js";
import { LoadFamilyTree } from "./LoadFamilyTree.js";
import { ShowModalPerson } from "./ShowModalPerson.js";

window.onload = function () {
    LoadFamilyTree();
    InitFamilyTreeEvents();
};

window.PersonRelationTypes = {
    Parent: "Parent",
    Sibling: "Sibling",
    Lover: "Lover",
    Child: "Child"
};

window._familyTrees = [];
window._currentFamilyTree = {
    Id: 0,
    Name: "",
    MainPersonId: 0
};
window._createPersonData = {
    Name: "",
    Surname: "",
    Middlename: "",
    Birthday: "",
    Gender: "",
    TreeId: 0,
    ParentNumber: 0,
    PersonRelationType: "",
    WifeId: 0,
    MainPersonId: 0
};
window._deletePersonId = null;

window.mainTree; // главное дерево
window.bloodTree; // дерево кровности
window.bloodFlag; // флаг на включенность режима кровного родства
window.visibleModal = false;

export function OnShowMainPersonButtonClick() {
    sessionStorage.removeItem("StartFamilyTree");
    document.location.reload();
}

export function OnUpdateMainPersonButtonClick(target) {
    let personId = $(target.currentTarget).parent().attr("data-value");

    UpdateMainPerson(personId).then((result) => {
        window._familyTrees = GetFamilyTrees();
        ShowStarButtons();
    }, (r) => console.error(r));
}

export function OnDeletePersonButtonClick() {
    $("#delete-person-modal").modal("show");
}

export function OnDeletePersonSubmitButtonClick() {
    DeletePerson(window._deletePersonId).then((result) => {
        if (window._currentFamilyTree.MainPersonId == window._deletePersonId)
            sessionStorage.removeItem("StartFamilyTree");
            window._deletePersonId = null;
        document.location.reload();
    });
}

export async function DeletePerson(personId) {
    return await $.ajax({
        method: "DELETE",
        url: "/People/Delete/" + personId
    });
}

export async function UpdateMainPerson(personId) {
    let result = await $.ajax({
        method: "PUT",
        data: {
            Id: window._currentFamilyTree.Id,
            PersonId: personId
        },
        url: "/FamilyTree/UpdateMainPerson/" + window._currentFamilyTree.Id
    });

    return result;
}

export function ShowStarButtons() {
    let peopleElements = $(".person, .LittleTreePerson");

    let visiblePeopleElements = peopleElements
        .filter((i, el) => $(el).css("visibility") === "visible");

    let hiddenPeopleElements = peopleElements
        .filter((i, el) => $(el).css("visibility") === "hidden");

    visiblePeopleElements.children(".star-button")
        .css("visibility", "visible");

    hiddenPeopleElements.children(".star-button")
        .css("visibility", "hidden");

    var tree = window._familyTrees
        .find((item) => item.Id == window._currentFamilyTree.Id);
        // var MainPersonId
    $(".person[data-value=\"" + tree.MainPersonId + "\"]")
        .children(".star-button")
        .first()
        .css("visibility", "hidden");

    $(".LittleTreePerson[data-value=\"" + tree.MainPersonId + "\"]")
        .children(".star-button")
        .first()
        .css("visibility", "hidden");
}

export function GetFamilyTrees() {
    let result = null;

    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        url: '/FamilyTree/GetAll',
        async: false,
        success: function (data) {
            result = data;
        }
    });

    return result;
}

export async function GetFamilyTree(familyTreeId, mainPersonId) {
    let result = await $.ajax({
        type: 'GET',
        dataType: 'json',
        url: "/FamilyTree/Get?id=" + familyTreeId + "&personId=" + mainPersonId
    });

    return result;
}

export function CreateFamilyTree(name) {
    let result = -1;

    $.ajax({
        type: 'POST',
        url: '/FamilyTree/Create',
        data: { Name: name },
        async: false,
        success: function (data) {
            result = data;
        }
    });

    return result;
}

export function ClearInputs() {
    $("#create-person-name").val("");
    $("#create-person-surname").val("");
    $("#create-person-middlename").val("");
    $("#create-person-birthday").val("");
    $("#create-person-block").find("input[name=\"person-gender\"][value=\"Unknown\"]").parent().click();
}

export function ShowHasNoTreesBlock(isShow = true) {
    $("#has-no-trees-block").css("display", isShow ? "block" : "none");
}

export function ShowStartTree(isShow = true) {
    $("#start-tree-block")[0].style.display = isShow ? "block" : "none";
}

export function ShowMainTree(isShow = true) {
    $("#main-tree-block")[0].style.display = isShow ? "block" : "none";
}

export function ShowCreatePersonForm(isShow = true) {
    $("#create-person-block")[0].style.display = isShow ? "block" : "none";
}

export function ShowPersonData(isShow = true) {
    $("#person-data-block")[0].style.display = isShow ? "block" : "none";
}

export function OnCreateFamilyTreeSubmitButtonClick() {
    let treeName = $("#create-family-tree-modal")
                        .find("#family-tree-name")
                        .val();

    if (CreateFamilyTree(treeName) == -1) {
        alert("Ошибка при создании дерева.");
        return;
    }

    window.location.reload();
}

// Изменение вида персоны на пустую
export function ChangeViewPersonBack(person, LittleTree) {
    if (person.lastElementChild.tagName == "IMG") {

        $(person).attr("data-toggle", "modal");
        $(person).attr("data-target", "#myModal");
        if (LittleTree) {
            $(person).addClass("LittleTreePerson");
        } else {
            $(person).addClass("person");
        }
        $(person).removeClass("newPerson");
        for (var i = 0; i < person.childNodes.length; i++) {
            $(person.childNodes[i]).removeClass("hiddenPersonContent");
        }
        $(person.lastElementChild).addClass("hiddenPersonContent");
    }
}

export function AddFuncs(pers) {
    $(pers.firstElementChild).dblclick(function (event) {
        if (event.target.parentElement.classList.contains("star-button")) return;

        window._currentFamilyTree.MainPersonId = $(event.currentTarget)[0].getAttribute("data-value");
        sessionStorage.setItem("StartFamilyTree", JSON.stringify(window._currentFamilyTree));

        document.location.reload();
    });

    $(pers.firstElementChild).hover(function (event) {
        ShowModalPerson(event);
    }, function () {
        setTimeout(function () {
            if (!window.visibleModal) {
                $("#modalBlockPerson")[0].style.visibility = "hidden";
            }
        }, 10);
    });

    return pers;
}

export function ReloadTree(personId) {
    GetFamilyTree(window._currentFamilyTree.Id, personId).then((result) => {
        $("#mainPerson")[0].setAttribute("data-value", personId);
        window.mainTree = result;
        FillTree(result, false);

        if (window.bloodFlag) {
            DrawBlood(0);
        }
        else {
            DrawConnections(result);
            DrawConntecionsLittleTree(result);
        }

        setTimeout(function () { ImageAlign(); }, 50);
        $("#modalBlockPerson")[0].style.visibility = "hidden";
    },
    (r) => {
        alert("Ошибка при обновлении дерева.");
    });
}

export function ChangeWifeTree(list) {
    var idNewWife = ($(list).find(".itemCurrent")[0].children[0]).getAttribute("data-value");
    var idMainPerson = $("#mainPerson")[0].getAttribute("data-value");

    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {
            id: window._currentFamilyTree.Id,
            personId: idMainPerson,
            wifeId: idNewWife
        },
        url: '/FamilyTree/Get',
        success: function (result) {
            window.mainTree = result;
            FillTree(result, true);
            if (window.bloodFlag) {
                DrawBlood(idNewWife);
            } else {
                DrawConnections(result);
                DrawConntecionsLittleTree(result);
            }

            setTimeout(function () { ImageAlign(); }, 50);
        }
    });
}