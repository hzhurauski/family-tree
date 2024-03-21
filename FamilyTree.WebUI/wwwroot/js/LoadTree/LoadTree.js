window.onload = function () {
    LoadFamilyTree();
    InitFamilyTreeEvents();
};

const PersonRelationTypes = {
    Parent: "Parent",
    Sibling: "Sibling",
    Lover: "Lover",
    Child: "Child"
};

let _familyTrees = [];
let _currentFamilyTree = {
    Id: 0,
    Name: "",
    MainPersonId: 0
};
let _createPersonData = {
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
let _deletePersonId = null;

var mainTree; // главное дерево
var bloodTree; // дерево кровности
var bloodFlag; // флаг на включенность режима кровного родства
var visibleModal = false;





function OnShowMainPersonButtonClick() {
    sessionStorage.removeItem("StartFamilyTree");
    document.location.reload();
}

function OnUpdateMainPersonButtonClick(target) {
    let personId = $(target.currentTarget).parent().attr("data-value");

    UpdateMainPerson(personId).then((result) => {
        _familyTrees = GetFamilyTrees();
        ShowStarButtons();
    }, (r) => console.error(r));
}

function OnDeletePersonButtonClick() {
    $("#delete-person-modal").modal("show");
}

function OnDeletePersonSubmitButtonClick() {
    DeletePerson(_deletePersonId).then((result) => {
        if (_currentFamilyTree.MainPersonId == _deletePersonId)
            sessionStorage.removeItem("StartFamilyTree");
        _deletePersonId = null;
        document.location.reload();
    });
}

async function DeletePerson(personId) {
    return await $.ajax({
        method: "DELETE",
        url: "/People/Delete/" + personId
    });
}

async function UpdateMainPerson(personId) {
    let result = await $.ajax({
        method: "PUT",
        data: {
            Id: _currentFamilyTree.Id,
            PersonId: personId
        },
        url: "/FamilyTree/UpdateMainPerson/" + _currentFamilyTree.Id
    });

    return result;
}

function ShowStarButtons() {
    let peopleElements = $(".person, .LittleTreePerson");

    let visiblePeopleElements = peopleElements
        .filter((i, el) => $(el).css("visibility") === "visible");

    let hiddenPeopleElements = peopleElements
        .filter((i, el) => $(el).css("visibility") === "hidden");

    visiblePeopleElements.children(".star-button")
        .css("visibility", "visible");

    hiddenPeopleElements.children(".star-button")
        .css("visibility", "hidden");

    let tree = _familyTrees
        .find((item) => item.Id == _currentFamilyTree.Id);

    $(".person[data-value=\"" + tree.MainPersonId + "\"]")
        .children(".star-button")
        .first()
        .css("visibility", "hidden");

    $(".LittleTreePerson[data-value=\"" + tree.MainPersonId + "\"]")
        .children(".star-button")
        .first()
        .css("visibility", "hidden");
}

function GetFamilyTrees() {
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

async function GetFamilyTree(familyTreeId, mainPersonId) {
    let result = await $.ajax({
        type: 'GET',
        dataType: 'json',
        url: "/FamilyTree/Get?id=" + familyTreeId + "&personId=" + mainPersonId
    });

    return result;
}

function CreateFamilyTree(name) {
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

function ClearInputs() {
    $("#create-person-name").val("");
    $("#create-person-surname").val("");
    $("#create-person-middlename").val("");
    $("#create-person-birthday").val("");
    $("#create-person-block").find("input[name=\"person-gender\"][value=\"Unknown\"]").parent().click();
}

function ShowHasNoTreesBlock(isShow = true) {
    $("#has-no-trees-block").css("display", isShow ? "block" : "none");
}

function ShowStartTree(isShow = true) {
    $("#start-tree-block")[0].style.display = isShow ? "block" : "none";
}

function ShowMainTree(isShow = true) {
    $("#main-tree-block")[0].style.display = isShow ? "block" : "none";
}

function ShowCreatePersonForm(isShow = true) {
    $("#create-person-block")[0].style.display = isShow ? "block" : "none";
}

function ShowPersonData(isShow = true) {
    $("#person-data-block")[0].style.display = isShow ? "block" : "none";
}

function OnCreateFamilyTreeSubmitButtonClick() {
    let treeName = $("#create-family-tree-modal")
                        .find("#family-tree-name")
                        .val();

    if (CreateFamilyTree(treeName) == -1) {
        alert("Ошибка при создании дерева.");
        return;
    }

    window.location.reload();
}

//-------


// Изменение вида персоны на пустую


function ChangeViewPersonBack(person, LittleTree) {
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



function AddFuncs(pers) {
    $(pers.firstElementChild).dblclick(function (event) {
        if (event.target.parentElement.classList.contains("star-button")) return;

        _currentFamilyTree.MainPersonId = $(event.currentTarget)[0].getAttribute("data-value");
        sessionStorage.setItem("StartFamilyTree", JSON.stringify(_currentFamilyTree));

        document.location.reload();
    });

    $(pers.firstElementChild).hover(function (event) {
        ShowModalPerson(event);
    }, function () {
        setTimeout(function () {
            if (!visibleModal) {
                $("#modalBlockPerson")[0].style.visibility = "hidden";
            }
        }, 10);
    });

    return pers;
}





function ReloadTree(personId) {
    GetFamilyTree(_currentFamilyTree.Id, personId).then((result) => {
        $("#mainPerson")[0].setAttribute("data-value", personId);
        mainTree = result;
        FillTree(result, false);

        if (bloodFlag) {
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



function ChangeWifeTree(list) {
    var idNewWife = ($(list).find(".itemCurrent")[0].children[0]).getAttribute("data-value");
    var idMainPerson = $("#mainPerson")[0].getAttribute("data-value");

    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {
            id: _currentFamilyTree.Id,
            personId: idMainPerson,
            wifeId: idNewWife
        },
        url: '/FamilyTree/Get',
        success: function (result) {
            mainTree = result;
            FillTree(result, true);
            if (bloodFlag) {
                DrawBlood(idNewWife);
            } else {
                DrawConnections(result);
                DrawConntecionsLittleTree(result);
            }

            setTimeout(function () { ImageAlign(); }, 50);
        }
    });
}









