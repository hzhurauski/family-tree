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

function LoadFamilyTree() {
    _familyTrees = GetFamilyTrees();

    if (_familyTrees.length == 0) {
        ShowHasNoTreesBlock();
        return;
    }
    else {
        let startTree = _familyTrees[0];

        if (sessionStorage.getItem("StartFamilyTree") === null) {
            sessionStorage.setItem("StartFamilyTree", JSON.stringify(startTree));
            _currentFamilyTree = startTree;
        }
        else {
            _currentFamilyTree = JSON.parse(sessionStorage.StartFamilyTree);

            let tree = _familyTrees.find((item) => item.Id == _currentFamilyTree.Id);

            if (tree == null)
                _currentFamilyTree = startTree;

            if (_currentFamilyTree.MainPersonId == null && tree.MainPersonId != null) {
                _currentFamilyTree.MainPersonId = tree.MainPersonId;
            }
        }

        $("#headerText")[0].innerText = _currentFamilyTree.Name; // устанавливаем имя

        if (_currentFamilyTree.MainPersonId == null) {
            ShowHasNoTreesBlock(false);
            ShowMainTree(false);
            ShowStartTree();
        }
        else {
            GetFamilyTree(_currentFamilyTree.Id, _currentFamilyTree.MainPersonId).then((result) => {
                mainTree = result;
                $("#mainPerson")[0].setAttribute("data-value", _currentFamilyTree.MainPersonId);
                FillTree(result, false);
                DrawConnections(result);
                DrawConntecionsLittleTree(result);
                $("#BlockFullTree")[0].style.display = "block";
                setTimeout(function () { ImageAlign(); }, 200);

                ShowStartTree(false);
                ShowHasNoTreesBlock(false);
                ShowMainTree();
                ShowStarButtons();
            }, (r) => {
                alert("Ошибка при получении дерева.");
            });
        }
    }
}

function InitFamilyTreeEvents() {
    $(".person").dblclick(function (event) {
        if (event.target.parentElement.classList.contains("star-button")) return;

        _currentFamilyTree.MainPersonId = $(event.currentTarget)[0].getAttribute("data-value");
        sessionStorage.setItem("StartFamilyTree", JSON.stringify(_currentFamilyTree));

        document.location.reload();
    });
    $(".person").hover(function (event) {
        ShowModalPerson(event);
    }, function () {
        setTimeout(function () {
            if (!visibleModal) {
                $("#modalBlockPerson")[0].style.visibility = "hidden";
            }
        }, 10);
    });
    $(".LittleTreePerson").dblclick(function (event) {
        //ReloadTree($(event.currentTarget)[0].getAttribute("data-value"));

        _currentFamilyTree.MainPersonId = $(event.currentTarget)[0].getAttribute("data-value");
        sessionStorage.setItem("StartFamilyTree", JSON.stringify(_currentFamilyTree));

        document.location.reload();
    });
    $(".LittleTreePerson").hover(function (event) {
        ShowModalPerson(event);
    }, function () {
        setTimeout(function () {
            if (!visibleModal) {
                $("#modalBlockPerson")[0].style.visibility = "hidden";
            }
        }, 10);
    });

    $("#modalBlockPerson").hover(function () {
        visibleModal = true;
    }, function () {
        $("#modalBlockPerson")[0].style.visibility = "hidden";
        visibleModal = false;
    });

    $("#wifes .PrevItem").click(function (event) {
        ChangeWifeTree($("#wifes .ListSlider")[0]);
        PrevItem($("#prevWife")[0]);
    });
    $("#wifes .NextItem").click(function (event) {
        ChangeWifeTree($("#wifes .ListSlider")[0]);
        NextItem($("#nextWife")[0]);
    });

    $("#wifes-LittleTree .PrevItem").click(function (event) {
        ChangeWifeTree($("#wifes-LittleTree .ListSlider")[0]);
        PrevItem($("#wifes .PrevItem")[0]);
    });
    $("#wifes-LittleTree .NextItem").click(function (event) {
        ChangeWifeTree($("#wifes-LittleTree .ListSlider")[0]);
        NextItem($("#wifes .NextItem")[0]);
    });

    // Дети
    $("#sons .PrevItem").click(function (event) {
        RedrawSonsHasSonConnections($("#sons .itemCurrent")[0], 3, document.getElementById("canvas4"), 3, 12);
    });
    $("#sons .NextItem").click(function (event) {
        RedrawSonsHasSonConnections($("#sons .itemCurrent")[0], 3, document.getElementById("canvas4"), 3, 12);
    });

    $("#sons-LittleTree .PrevItem").click(function (event) {
        RedrawSonsHasSonConnections($("#sons-LittleTree .itemCurrent")[0], 2, document.getElementById("canvas8"), 5, 18);
    });
    $("#sons-LittleTree .NextItem").click(function (event) {
        RedrawSonsHasSonConnections($("#sons-LittleTree .itemCurrent")[0], 2, document.getElementById("canvas8"), 5, 18);
    });

    // Изменеие масштаба дерева
    $("#ScaleTree").click(function () {
        if ($("#ScaleTree")[0].innerText == "Увеличить масштаб") {
            $("#BlockFullTree")[0].style.display = "none";
            $("#BlockPartTree")[0].style.display = "block";
            $("#ScaleTree")[0].innerText = "Уменьшить масштаб";
            ImageAlign();
        } else {
            $("#BlockFullTree")[0].style.display = "block";
            $("#BlockPartTree")[0].style.display = "none";
            $("#ScaleTree")[0].innerText = "Увеличить масштаб";
            ImageAlign();
        }
    });
    $("#BloodTree").click(function () {
        var btnBlood = $("#BloodTree")[0];

        if (btnBlood.style.backgroundColor == "") {
            btnBlood.style.backgroundColor = "#900000";
            btnBlood.style.color = "#FFF";

            $(btnBlood).attr("data-value", $("#mainPerson")[0].getAttribute("data-value"));
            bloodFlag = true;

            DrawBlood(0);

        } else {
            btnBlood.style.backgroundColor = "";
            btnBlood.style.color = "";
            bloodFlag = false;

            DrawConnections(mainTree);
            DrawConntecionsLittleTree(mainTree);
        }
    });

    // Добавление человека
    $(".newPerson").click(function (event) {
        if (event.currentTarget.classList.contains("newPerson")) {
            AddNewPerson(event);
        }

    });
    $(".person").click(function (event) {
        if (event.currentTarget.classList.contains("newPerson")) {
            AddNewPerson(event);
        }
    });

    $(".LittleTreePerson").click(function (event) {
        if (event.currentTarget.classList.contains("newPerson")) {
            AddNewPerson(event);
        }
    });
    $(".AddPerson-Tree").click(function (event) {
        AddOneMorePerson(event);
    });
    $(".AddPerson-LittleTree").click(function (event) {
        AddOneMorePerson(event);
    });

    $("#editPersonModal").click((e) => {
        let personId = $(e.currentTarget).attr("data-id");
        LoadPersonData(personId).then((result) => {
            if (result) {
                ShowMainTree(false);
                ShowPersonData();
            }
        });        
    });

    $("#start-tree-block").click(() => {
        ShowStartTree(false);
        ShowCreatePersonForm();
    });

    $("#cancel-person-button").click(() => {
        ShowCreatePersonForm(false);
        if (_familyTrees.length == 0)
            ShowStartTree();
        else
            ShowMainTree();

        ClearInputs();
    });

    $("#save-person-button").click(() => {
        _createPersonData.Name = $("#create-person-name").val();
        _createPersonData.Surname = $("#create-person-surname").val();
        _createPersonData.Middlename = $("#create-person-middlename").val();
        _createPersonData.Birthday = $("#create-person-birthday").val();
        _createPersonData.Gender = $("input[name=\"person-gender\"]:checked").val();
        _createPersonData.TreeId = _currentFamilyTree.Id;

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/People/Create',
            data: _createPersonData,
            success: function (data) {
                /*
                if (_currentFamilyTree.MainPersonId == null) {
                    $("#mainPerson")[0].setAttribute("data-value", data);
                    _currentFamilyTree = GetFamilyTrees().find(ft => ft.Id == _currentFamilyTree.Id);
                }           
                */         

                //ReloadTree($("#mainPerson")[0].getAttribute("data-value"));
                document.location.reload();

                ShowCreatePersonForm(false);
                ShowMainTree();
                ClearInputs();
            },
            error: () => {
                alert("Ошибка при создании персоны.");
            }
        });
    });

    $("#back-to-tree-button").click(() => {
        ShowPersonData(false);
        ShowMainTree();
    });

    $("#create-family-tree-button")
        .click(() => $("#create-family-tree-modal").modal("show"));

    $("#create-family-tree-submit-button")
        .click(OnCreateFamilyTreeSubmitButtonClick);

    $(".star-button")
        .click(OnUpdateMainPersonButtonClick);

    $("#show-main-person-button")
        .click(OnShowMainPersonButtonClick);

    $("#delete-person-submit-button")
        .click(OnDeletePersonSubmitButtonClick);

    $("#delete-person-button")
        .click(OnDeletePersonButtonClick);
}

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
function FillTree(tree, wifePart) {

    if (!wifePart) { // если заполнять только дерево со стороны жены, то пропустить этот блок

        // Главная персона
        FillPerson($("#mainPerson")[0], tree.MainPerson);
        FillPerson($("#mainPerson-LittleTree")[0], tree.MainPerson); // для увеличенного масштаба дерева (УМД в дальнейшем)

        // Родители
        if (tree.Parent_1 == null) {
            ChangeViewPerson($("#blood-parentOne")[0], false);
            ChangeViewPerson($("#blood-parentOne-LittleTree")[0], true); // для УМД
        } else {
            ChangeViewPersonBack($("#blood-parentOne")[0], false);
            ChangeViewPersonBack($("#blood-parentOne-LittleTree")[0], true); // для УМД
            FillPerson($("#blood-parentOne")[0], tree.Parent_1);
            FillPerson($("#blood-parentOne-LittleTree")[0], tree.Parent_1); // для УМД
        }
        if (tree.Parent_2 == null) {
            ChangeViewPerson($("#blood-parentTwo")[0], false);
            ChangeViewPerson($("#blood-parentTwo-LittleTree")[0], true); // для УМД
        } else {
            ChangeViewPersonBack($("#blood-parentTwo")[0], false);
            ChangeViewPersonBack($("#blood-parentTwo-LittleTree")[0], true); // для УМД
            FillPerson($("#blood-parentTwo")[0], tree.Parent_2);
            FillPerson($("#blood-parentTwo-LittleTree")[0], tree.Parent_2); // для УМД
        }

        var grand;

        // Родители родителя 1       
        if (tree.Parent_1 != null) {

            grand = $("#blood-grandOne")[0];
            grand.style.visibility = "visible";
            grand = $("#blood-grandTwo")[0];
            grand.style.visibility = "visible";

            if (tree.Grand_1_1 == null) {
                ChangeViewPerson($("#blood-grandOne")[0], false);
            } else {
                ChangeViewPersonBack($("#blood-grandOne")[0], false);
                FillPerson($("#blood-grandOne")[0], tree.Grand_1_1);
            }
            if (tree.Grand_1_2 == null) {
                ChangeViewPerson($("#blood-grandTwo")[0], false);
            } else {
                ChangeViewPersonBack($("#blood-grandTwo")[0], false);
                FillPerson($("#blood-grandTwo")[0], tree.Grand_1_2);
            }
        } else {
            grand = $("#blood-grandOne")[0];
            grand.style.visibility = "hidden";
            grand = $("#blood-grandTwo")[0];
            grand.style.visibility = "hidden";
        }

        // Родители родителя 2
        if (tree.Parent_2 != null) {

            grand = $("#blood-grandThree")[0];
            grand.style.visibility = "visible";
            grand = $("#blood-grandFour")[0];
            grand.style.visibility = "visible";

            if (tree.Grand_2_1 == null) {
                ChangeViewPerson($("#blood-grandThree")[0], false);
            } else {
                ChangeViewPersonBack($("#blood-grandThree")[0], false);
                FillPerson($("#blood-grandThree")[0], tree.Grand_2_1);
            }
            if (tree.Grand_2_2 == null) {
                ChangeViewPerson($("#blood-grandFour")[0], false);
            } else {
                ChangeViewPersonBack($("#blood-grandFour")[0], false);
                FillPerson($("#blood-grandFour")[0], tree.Grand_2_2);
            }
        } else {
            grand = $("#blood-grandThree")[0];
            grand.style.visibility = "hidden";
            grand = $("#blood-grandFour")[0];
            grand.style.visibility = "hidden";
        }

        // Братья и сестры
        var listSlider = $("#brothers .ListSlider")[0];
        var itemSize = $("#brothers .itemSize").val();
        var itemMargin = $("#brothers .itemMargin").val();
        var itemMarginPerson = (itemSize - 0) + (itemMargin - 0);
        var listSlider_LittleTree = $("#brothers-LittleTree .ListSlider")[0];  // для УМД (для увеличенного масштаба дерева)
        var itemSize_LittleTree = $("#brothers-LittleTree .itemSize").val();  // для УМД
        var itemMargin_LittleTree = $("#brothers-LittleTree .itemMargin").val();  // для УМД
        var itemMarginPerson_LittleTree = (itemSize_LittleTree - 0) + (itemMargin_LittleTree - 0);  // для УМД

        // сбросиить смещение слайдера
        listSlider.style.transform = "translateX(0px)";
        listSlider_LittleTree.style.transform = "translateX(0px)";

        FillBrothers(tree, listSlider, itemMarginPerson, 3);
        FillBrothers(tree, listSlider_LittleTree, itemMarginPerson_LittleTree, 2);  // для УМД    


        // Жены
        listSlider = $("#wifes .ListSlider")[0];
        itemSize = $("#wifes .itemSize").val();
        itemMargin = $("#wifes .itemMargin").val();
        itemMarginPerson = (itemSize - 0) + (itemMargin - 0);
        listSlider_LittleTree = $("#wifes-LittleTree .ListSlider")[0]; // для УМД    
        itemSize_LittleTree = $("#wifes-LittleTree .itemSize").val(); // для УМД    
        itemMargin_LittleTree = $("#wifes-LittleTree .itemMargin").val(); // для УМД    
        itemMarginPerson_LittleTree = (itemSize_LittleTree - 0) + (itemMargin_LittleTree - 0); // для УМД    

        // сбросиить смещение слайдера
        listSlider.style.transform = "translateX(0px)";
        listSlider_LittleTree.style.transform = "translateX(0px)";

        FillWifes(tree, listSlider, itemMarginPerson, 2);
        FillWifes(tree, listSlider_LittleTree, itemMarginPerson_LittleTree, 1);  // для УМД (для увеличенного масштаба дерева)
    }

    // Родители жены
    if (tree.Wifes != null) {
        grand = $("#parentOne")[0];
        grand.style.visibility = "visible";
        grand = $("#parentTwo")[0];
        grand.style.visibility = "visible";

        if (tree.Parent_W_1 == null) {
            ChangeViewPerson($("#parentOne")[0], false);
        } else {
            ChangeViewPersonBack($("#parentOne")[0], false);
            FillPerson($("#parentOne")[0], tree.Parent_W_1);
        }
        if (tree.Parent_W_2 == null) {
            ChangeViewPerson($("#parentTwo")[0], false);
        } else {
            ChangeViewPersonBack($("#parentTwo")[0], false);
            FillPerson($("#parentTwo")[0], tree.Parent_W_2);
        }
    } else {
        grand = $("#parentOne")[0];
        grand.style.visibility = "hidden";
        grand = $("#parentTwo")[0];
        grand.style.visibility = "hidden";
    }

    // Родители родителя 1 жены
    if (tree.Parent_W_1 != null) {

        grand = $("#grandOne")[0];
        grand.style.visibility = "visible";
        grand = $("#grandTwo")[0];
        grand.style.visibility = "visible";

        if (tree.Grand_W_1_1 == null) {
            ChangeViewPerson($("#grandOne")[0], false);
        } else {
            ChangeViewPersonBack($("#grandOne")[0], false);
            FillPerson($("#grandOne")[0], tree.Grand_W_1_1);
        }
        if (tree.Grand_W_1_2 == null) {
            ChangeViewPerson($("#grandTwo")[0], false);
        } else {
            ChangeViewPersonBack($("#grandTwo")[0], false);
            FillPerson($("#grandTwo")[0], tree.Grand_W_1_2);
        }
    } else {
        grand = $("#grandOne")[0];
        grand.style.visibility = "hidden";
        grand = $("#grandTwo")[0];
        grand.style.visibility = "hidden";
    }

    // Родители родителя 2 жены
    if (tree.Parent_W_2 != null) {

        grand = $("#grandThree")[0];
        grand.style.visibility = "visible";
        grand = $("#grandFour")[0];
        grand.style.visibility = "visible";

        if (tree.Grand_W_2_1 == null) {
            ChangeViewPerson($("#grandThree")[0], false);
        } else {
            ChangeViewPersonBack($("#grandThree")[0], false);
            FillPerson($("#grandThree")[0], tree.Grand_W_2_1);
        }
        if (tree.Grand_W_2_2 == null) {
            ChangeViewPerson($("#grandFour")[0], false);
        } else {
            ChangeViewPersonBack($("#grandFour")[0], false);
            FillPerson($("#grandFour")[0], tree.Grand_W_2_2);
        }
    } else {
        grand = $("#grandThree")[0];
        grand.style.visibility = "hidden";
        grand = $("#grandFour")[0];
        grand.style.visibility = "hidden";
    }

    // Дети
    listSlider = $("#sons .ListSlider")[0];
    itemSize = $("#sons .itemSize").val();
    itemMargin = $("#sons .itemMargin").val();
    itemMarginPerson = (itemSize - 0) + (itemMargin - 0);
    listSlider_LittleTree = $("#sons-LittleTree .ListSlider")[0]; // для УМД    
    itemSize_LittleTree = $("#sons-LittleTree .itemSize").val(); // для УМД    
    itemMargin_LittleTree = $("#sons-LittleTree .itemMargin").val(); // для УМД    
    itemMarginPerson_LittleTree = (itemSize_LittleTree - 0) + (itemMargin_LittleTree - 0); // для УМД    

    // сбросить смещение слайдера
    listSlider.style.transform = "translateX(0px)";
    listSlider_LittleTree.style.transform = "translateX(0px)";

    FillChildren(tree, listSlider, itemMarginPerson, 3);
    FillChildren(tree, listSlider_LittleTree, itemMarginPerson_LittleTree, 2); // для УМД  (для увеличенного масштаба дерева)  

    // Ребенок от второго брака
    var anotherSon = $("#sonAnotherWife")[0];

    if (tree.ChildWife_2 != null) {
        anotherSon.style.visibility = "visible";
        FillPerson($("#sonAnotherWife")[0], tree.ChildWife_2);
    }
    else {
        anotherSon.style.visibility = "hidden";
    }
}

function FillWifes(tree, listSlider, itemMarginPerson, NumWifes) {

    if (NumWifes == 1) { // для УМД
        var Prev = $("#wifes-LittleTree .PrevItem")[0];
        var Next = $("#wifes-LittleTree .NextItem")[0];
        var Add = $("#wifes-LittleTree .AddPerson-LittleTree")[0];
        var wife = $("#wifeOne-LittleTree")[0];
        var main = "wifeOne-LittleTree";
        var LittleTree = true;
    } else {
        Prev = $("#wifes .PrevItem")[0];
        Next = $("#wifes .NextItem")[0];
        Add = $("#wifes .AddPerson-Tree")[0];
        wife = $("#wifeOne")[0];
        main = "wifeOne";
        LittleTree = false;
    }

    wife.parentElement.style.left = "0px";

    // Удалениие лишних записей           
    while (listSlider.children.length > 1) {
        if (listSlider.children[0].firstElementChild.id != main) {
            listSlider.firstElementChild.remove();
        } else {
            listSlider.lastElementChild.remove();
        }
    }

    wife.parentElement.classList.remove("itemAfter");
    wife.parentElement.classList.remove("itemBefore");
    wife.parentElement.classList.add("itemCurrent");


    if (tree.Wifes != null && tree.Wifes.length > 0) {

        ChangeViewPersonBack(wife, LittleTree);
        FillPerson(wife, tree.Wifes[0]);

        if (tree.Wifes.length == 1) {
            if (NumWifes == 1) {
                Prev.style.visibility = "hidden";
                Next.style.display = "none";
                Add.style.marginLeft = "300px";
            } else {
                Prev.style.display = "none";
                Next.style.display = "none";
                Add.style.marginLeft = "50px";
            }

        } else {
            Prev.style.visibility = "";
            Next.style.visibility = "";
            Prev.style.display = "block";
            Next.style.display = "block";
            Add.style.visibility = "";
            if (NumWifes == 1) {
                Add.style.marginLeft = "352px";
            } else {
                Add.style.marginLeft = "0px";
            }

            if (tree.Wifes.length == 2) {
                // Этот цикл необходим для того, чтобы если 2 жены, 
                // то отображаются еще 2 клона для удобства слайдера,
                // а так как 1 жена уже вписана, необходимо добавить еще 3 записи,
                // начиная со 2 жены 
                for (var i = 0; i < 3; i++) {
                    var pers;
                    if (i == 0) {
                        pers = GetPerson(tree.Wifes[i + 1], LittleTree);
                    }
                    else {
                        pers = GetPerson(tree.Wifes[i - 1], LittleTree);
                    }

                    pers = AddFuncs(pers);

                    pers.classList.add("itemAfter");
                    pers.style.left = (itemMarginPerson * (i + 1)) + "px";
                    listSlider.appendChild(pers);
                }
            } else {
                for (var i = 1; i < tree.Wifes.length; i++) {
                    var pers = GetPerson(tree.Wifes[i], LittleTree);

                    pers = AddFuncs(pers);

                    pers.classList.add("itemAfter");
                    pers.style.left = (itemMarginPerson * i) + "px";
                    listSlider.appendChild(pers);
                }
            }

        }
    }
    else {
        ChangeViewPerson(wife, LittleTree);

        Prev.style.visibility = "hidden";
        Next.style.visibility = "hidden";
        Add.style.visibility = "hidden";
    }
}

function FillChildren(tree, listSlider, itemMarginPerson, NumChild) {

    if (NumChild == 2) { // для УМД
        var Prev = $("#sons-LittleTree .PrevItem")[0];
        var Next = $("#sons-LittleTree .NextItem")[0];
        var Add = $("#sons-LittleTree .AddPerson-LittleTree")[0];
        var newSon = $("#sonOne-LittleTree")[0];
        var main = "sonOne-LittleTree";
        var LittleTree = true;
    } else {
        var Prev = $("#sons .PrevItem")[0];
        var Next = $("#sons .NextItem")[0];
        var Add = $("#sons .AddPerson-Tree")[0];
        var newSon = $("#sonOne")[0];
        var main = "sonOne";
        var LittleTree = false;
    }

    // Удалениие лишних записей           
    while (listSlider.children.length > 1) {
        if (listSlider.children[0].firstElementChild.id != main) {
            listSlider.firstElementChild.remove();
        } else {
            listSlider.lastElementChild.remove();
        }
    }

    newSon.parentElement.classList.remove("itemAfter");
    newSon.parentElement.classList.remove("itemBefore");
    newSon.parentElement.classList.add("itemCurrent");

    if (NumChild != 2) {
        if (tree.Children != null && tree.Children.length > 0) {
            var pers;
            pers = $("#sonOne")[0];
            ChangeViewPersonBack(pers, LittleTree);
            FillPerson(pers, tree.Children[0]);

            if (tree.Children.length == 1) {
                pers.parentElement.style.left = (itemMarginPerson * 2) + "px";
            } else
                if (tree.Children.length == 2) {

                    pers.parentElement.style.left = (itemMarginPerson) + "px";

                    pers = GetPerson(tree.Children[1], false);
                    pers.classList.add("itemAfter");
                    pers.style.left = (itemMarginPerson * 2) + "px";

                    pers = AddFuncs(pers);

                    listSlider.appendChild(pers);
                } else {
                    pers.parentElement.style.left = "0px";

                    for (var i = 1; i < tree.Children.length; i++) {
                        var pers = GetPerson(tree.Children[i], false);
                        pers.classList.add("itemAfter");
                        pers.style.left = (itemMarginPerson * i) + "px";

                        pers = AddFuncs(pers);

                        listSlider.appendChild(pers);
                    }
                }

            if (tree.Children.length < 4) {
                Prev.style.visibility = "hidden";
                Next.style.display = "none";
                Add.style.marginLeft = "415px";
            } else {
                Prev.style.visibility = "";
                Next.style.display = "block";
                Add.style.marginLeft = "480px";
            }
        }
        else {
            ChangeViewPerson(newSon, LittleTree);
            newSon.parentElement.style.left = (itemMarginPerson * 2) + "px";
            Prev.style.visibility = "hidden";
            Next.style.display = "none";
            Add.style.display = "none";
        }
    } else { // для УМД
        if (tree.Children != null && tree.Children.length > 0) {
            var pers;
            pers = $("#sonOne-LittleTree")[0];
            ChangeViewPersonBack(pers, true);
            FillPerson(pers, tree.Children[0]);

            if (tree.Children.length == 1) {
                pers.parentElement.style.left = itemMarginPerson + "px";
            } else {

                pers.parentElement.style.left = "0px";

                for (var i = 1; i < tree.Children.length; i++) {
                    var pers = GetPerson(tree.Children[i], true);

                    pers = AddFuncs(pers);

                    pers.classList.add("itemAfter");
                    pers.style.left = (itemMarginPerson * i) + "px";
                    listSlider.appendChild(pers);
                }
            }

            if (tree.Children.length < 3) {
                Prev.style.visibility = "hidden";
                Next.style.display = "none";
                Add.style.marginLeft = "30px";
            } else {
                Prev.style.visibility = "visible";
                Next.style.display = "block";
                Add.style.marginLeft = "20px";
            }
        }
        else {
            ChangeViewPerson(newSon, true);
            newSon.parentElement.style.left = itemMarginPerson + "px";

            Prev.style.visibility = "hidden";
            Next.style.display = "none";
            Add.style.display = "none";
        }
    }
}

// Функция заполнения братьев
// NumBrothers - количество видимых людей в слайдере "Братья"
function FillBrothers(tree, listSlider, itemMarginPerson, NumBrothers) {
    if (NumBrothers == 2) { // для УМД
        var Prev = $("#brothers-LittleTree .PrevItem")[0];
        var Next = $("#brothers-LittleTree .NextItem")[0];
        var Add = $("#brothers-LittleTree .AddPerson-LittleTree")[0];
        var main = "mainPerson-LittleTree";

    } else {
        var Prev = $("#brothers .PrevItem")[0];
        var Next = $("#brothers .NextItem")[0];
        var Add = $("#brothers .AddPerson-Tree")[0];
        var main = "mainPerson";
    }

    var mainPers = $("#" + main)[0].parentElement;
    mainPers.style.left = ((NumBrothers - 1) * itemMarginPerson) + "px";

    // Удалениие лишних записей            
    while (listSlider.children.length > 1) {
        if (listSlider.children[0].firstElementChild.id != main) {
            listSlider.firstElementChild.remove();
        } else {
            listSlider.lastElementChild.remove();
        }
    }

    mainPers.classList.remove("itemAfter");
    mainPers.classList.remove("itemBefore");
    mainPers.classList.add("itemCurrent");

    // Добавление братьев
    if (NumBrothers == 3) {

        if (tree.Brothers != null && tree.Brothers.length > 0) {
            if (tree.Brothers.length < 3) {

                for (var i = 0; i < tree.Brothers.length; i++) {
                    var pers = GetPerson(tree.Brothers[i], false);
                    if (i == 0) {
                        pers.classList.add("itemAfter");
                        pers.style.left = (itemMarginPerson) + "px";
                    }
                    else {
                        pers.classList.add("itemCurrent");
                        pers.style.left = "0px";
                    }

                    pers = AddFuncs(pers);

                    listSlider.insertBefore(pers, listSlider.firstElementChild);
                }

                Prev.style.visibility = "hidden";
                Next.style.display = "none";
                Add.style.marginLeft = "415px";
            }
            else {
                Prev.style.visibility = "";
                Next.style.display = "block";
                Add.style.marginLeft = "480px";

                for (var i = 0; i < tree.Brothers.length; i++) {
                    var pers = GetPerson(tree.Brothers[i], false);

                    pers = AddFuncs(pers);

                    if (i == 0) {
                        pers.classList.add("itemAfter");
                        pers.style.left = (itemMarginPerson) + "px";
                    } else
                        if (i == 1) {
                            pers.classList.add("itemCurrent");
                            pers.style.left = "0px";
                        } else {
                            pers.classList.add("itemAfter");
                            pers.style.left = (itemMarginPerson * (i + 1)) + "px";
                            listSlider.appendChild(pers);
                            continue;
                        }
                    listSlider.insertBefore(pers, listSlider.firstElementChild);
                }
            }
        } else {
            Prev.style.visibility = "hidden";
            Next.style.display = "none";
            Add.style.marginLeft = "415px";
            if (tree.Parent_1 == null && tree.Parent_2 == null) {
                Add.style.display = "none";
            } else {
                Add.style.display = "block";
            }
        }
    } else { // для УМД

        var mainElem = $("#mainPerson-LittleTree")[0];

        if (tree.Brothers != null && tree.Brothers.length > 0) {

            listSlider.parentElement.style.width = "430px";
            mainElem.parentElement.style.left = "230px";

            if (tree.Brothers.length < 2) {
                var pers = GetPerson(tree.Brothers[0], true);
                pers.classList.add("itemCurrent");
                pers.style.left = "0px";

                pers = AddFuncs(pers);

                listSlider.insertBefore(pers, listSlider.firstElementChild);

                Prev.style.display = "none";
                Next.style.display = "none";
                Add.style.marginLeft = "50px";
            }
            else {
                Prev.style.display = "block";
                Next.style.display = "block";
                Add.style.marginLeft = "0px";

                for (var i = 0; i < tree.Brothers.length; i++) {
                    var pers = GetPerson(tree.Brothers[i], true);

                    pers = AddFuncs(pers);

                    if (i == 0) {
                        pers.classList.add("itemCurrent");
                        pers.style.left = "0px";
                    } else {
                        pers.classList.add("itemAfter");
                        pers.style.left = (itemMarginPerson * (i + 1)) + "px";
                        listSlider.appendChild(pers);
                        continue;
                    }
                    listSlider.insertBefore(pers, listSlider.firstElementChild);
                }
            }
        } else {
            Prev.style.display = "none";
            Next.style.display = "none";
            Add.style.marginLeft = "278px";
            listSlider.parentElement.style.width = "202px";

            mainElem.parentElement.style.left = "0px";
        }
    }
}

// Заполнение атрибутов персонажа
function FillPerson(person, data) {
    $(person).attr("data-value", data.Id);
    
        $(person).find(".surname")[0].innerText = data.Surname;
        
        $(person).find(".name")[0].innerText = data.Name;

        $(person).find(".middlename")[0].innerText = data.Middlename;
    // Дополнение: получение даты рождения для вывода в карточке человека.
    
        $(person).find(".birthday")[0].innerText = data.Birthday;
    // Дополнение: получение даты рождения для вывода в карточке человека.

    // Текстовое представление изображения
    if (data.AvatarImageId != null) {
        person.firstElementChild.firstElementChild.src = "/Media/Image/GetFile/" + data.AvatarImageId;
        person.firstElementChild.firstElementChild.decoding = "async";
    } else {
        person.firstElementChild.firstElementChild.src = "/images/person.png";
        person.firstElementChild.firstElementChild.decoding = "async";
    }
}

// Изменение вида персоны на пустую
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

function GetPerson(person, LittleTree) {
    var LiElem = document.createElement('li');
    LiElem.classList.add("itemSlider");

    var newBlockId = document.createElement('div');
    if (LittleTree) {
        newBlockId.classList.add("LittleTreePerson");
    } else {
        newBlockId.classList.add("person");
    }

    $(newBlockId).attr("data-toggle", "modal");
    $(newBlockId).attr("data-target", "#myModal");
    $(newBlockId).attr("data-value", person.Id);

    var newImg = document.createElement('img');
    newImg.classList.add("imgPerson");

    if (person.AvatarImage != null) {
        newImg.src = "data:image/" + person.AvatarImage.ImageFormat + ";base64," + person.AvatarImage.ImageData;
    } else {
        newImg.src = "/images/person.png";
    }

    var newImgBlock = document.createElement('div');
    newImgBlock.classList.add("imgBlock");
    newImgBlock.appendChild(newImg);

    var Surname = document.createElement('div');
    Surname.classList.add("surname");
    Surname.innerText = person.Surname;

    var Name = document.createElement('div');
    Name.classList.add("name");
    Name.innerText = person.Name;

    var MiddleName = document.createElement('div');
    MiddleName.classList.add("middlename");
    MiddleName.innerText = person.Middlename;

    // Дополнение: Дата рождения в карточке пользователя на главном меню
    var Birthday = document.createElement('div');
    Birthday.classList.add("birthday");
    Birthday.innerText = person.Birthday;
    // Дополнение: Дата рождения в карточке пользователя на главном меню

    var Block = document.createElement('div');
    Block.appendChild(Surname);
    Block.appendChild(Name);
    Block.appendChild(MiddleName);
    // Дополнение: получение даты рождения для вывода в карточке человека.
    Block.appendChild(Birthday);
    // Дополнение: получение даты рождения для вывода в карточке человека.

    let starButtonElement = document.createElement('div');
    starButtonElement.classList.add("star-button");
    starButtonElement.classList.add("btn");
    starButtonElement.classList.add("btn-default");

    let starElement = document.createElement('i');
    starElement.classList.add("fas");
    starElement.classList.add("fa-star");
    starButtonElement.appendChild(starElement);

    newBlockId.appendChild(newImgBlock);
    newBlockId.appendChild(Block);
    newBlockId.appendChild(starButtonElement);

    $(starButtonElement)
        .click(OnUpdateMainPersonButtonClick);

    LiElem.appendChild(newBlockId);

    return LiElem;
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

// Функции рисования
function draw(context, x0, y0, x1, y1, width, color, dash, dashLength, back) {
    if (dash) {
        context.setLineDash([dashLength, 7]);
    } else {
        context.setLineDash([dashLength, 0]);
    }

    if (back) {
        context.strokeStyle = color;
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(x0, y0);
        context.bezierCurveTo(x0 - 10, y1, x1 + 10, y0, x1, y1);
        context.stroke();
    } else {
        context.strokeStyle = color;
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(x0, y0);
        context.bezierCurveTo(x0 + 10, y1, x1 - 10, y0, x1, y1);
        context.stroke();
    }
}

function drawLine(context, x0, y0, x1, y1, width, color, dash, dashLength) {
    if (dash) {
        context.setLineDash([dashLength, 7]);
    } else {
        context.setLineDash([dashLength, 0]);
    }

    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x0, y0);
    context.bezierCurveTo(x0, y0 + (y1 - y0) / 2, x1, y0 + (y1 - y0) / 2, x1, y1);
    context.stroke();
}

function drawHalf(context, x0, y0, x1, y1, width, color, dash, dashLength) {
    if (dash) {
        context.setLineDash([dashLength, 7]);
    } else {
        context.setLineDash([dashLength, 0]);
    }

    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x0, y0);
    context.bezierCurveTo(x0, y1, x1, y1, x1, y1);
    context.stroke();
}

function drawHalfUp(context, x0, y0, x1, y1, width, color, dash, dashLength) {
    if (dash) {
        context.setLineDash([dashLength, 7]);
    } else {
        context.setLineDash([dashLength, 0]);
    }
    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x0, y0);
    context.bezierCurveTo(x1, y0, x1, y1, x1, y1);
    context.stroke();
}

function DrawConnections(tree, blood) {
    var colorDefault = "#0080FF"; // Основной
    var colorBlood = "#900000"; // Кровавый
    var colorMuted = "#90B2D5"; // Основной приглушенный
    var colorBloodMuted = "#904949"; // Кровавый приглушенный
    var colorLine = colorDefault;
    var width = 3;
    var dashLength = 12;
    /// canvas 0 ///
    var canvas = document.getElementById("canvas0");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // One        
    for (var i = 0; i < 8; i++) {
        if (tree.Grand_has_parent[i] == true) {
            if (bloodFlag) if (bloodTree.Grand[i]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;

            drawLine(context, 50 + 150 * i, 15, 50 + 150 * i, 50, width, colorLine, true, dashLength);
        }
    }

    /// canvas 1 ///
    canvas = document.getElementById("canvas1");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Ones
    for (var i = 0; i < 8; i++) {
        if (tree.Grand_has_another_child[i] == true) {
            if (bloodFlag)
                if (bloodTree.Grand[i])
                    colorLine = colorBloodMuted;
                else colorLine = colorMuted;
            else colorLine = colorMuted;

            if (i % 2 == 0) {
                drawHalf(context, 50 + 300 * i / 2, 0, 0 + 300 * i / 2, 30, width, colorLine, true, dashLength);
            } else {
                drawHalf(context, 200 + 300 * (i - 1) / 2, 0, 250 + 300 * (i - 1) / 2, 30, width, colorLine, true, dashLength);
            }
        }
    }

    for (var i = 0; i < 4; i++) {
        if (tree.Parent_has_brother[i] == true) {
            if (bloodFlag) if (bloodTree.Parent[i]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;

            drawHalf(context, 125 + 300 * i, 60, 75 + 300 * i, 90, width, colorLine, true, dashLength);
        }
    }

    var arrGrand = [
        tree.Grand_1_1, tree.Grand_1_2, tree.Grand_2_1, tree.Grand_2_2,
        tree.Grand_W_1_1, tree.Grand_W_1_2, tree.Grand_W_2_1, tree.Grand_W_2_2
    ];
    var arrParent = [
        tree.Parent_1, tree.Parent_2, tree.Parent_W_1, tree.Parent_W_2
    ];

    // Есть ли дедушка
    for (var i = 0; i < 8; i++) {
        if (i % 2 == 0) {
            if (arrGrand[i] != null) {
                if (bloodFlag) if (bloodTree.Grand[i]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;

                draw(context, 50 + 300 * i / 2, 0, 125 + 300 * i / 2, 60, width, colorLine, false, dashLength, false);
            }
            else {
                if (arrParent[Math.trunc(i / 2)] != null) {
                    draw(context, 50 + 300 * i / 2, 0, 125 + 300 * i / 2, 60, width, colorMuted, true, dashLength, false);
                }
            }
        } else {
            if (arrGrand[i] != null) {
                if (bloodFlag) if (bloodTree.Grand[i]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;
                draw(context, 200 + 300 * (i - 1) / 2, 0, 125 + 300 * (i - 1) / 2, 60, width, colorLine, false, dashLength, true);
            }
            else {
                if (arrParent[Math.trunc(i / 2)] != null) {
                    draw(context, 200 + 300 * (i - 1) / 2, 0, 125 + 300 * (i - 1) / 2, 60, width, colorMuted, true, dashLength, true);
                }
            }
        }
    }

    for (var i = 0; i < 4; i++) {
        if (arrParent[i] != null) {
            if (arrGrand[i * 2] == null && arrGrand[i * 2 + 1] == null) {
                drawLine(context, 125 + 300 * i, 60, 125 + 300 * i, 100, width, colorMuted, true, dashLength);
            } else {
                if (bloodFlag) if (bloodTree.Parent[i]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;
                drawLine(context, 125 + 300 * i, 60, 125 + 300 * i, 100, width, colorLine, false, dashLength);
            }
        }
    }

    /// canvas 2 ///
    canvas = document.getElementById("canvas2");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // One
    // Братья
    if (tree.Brothers != null && tree.Brothers.length > 0) {
        if (bloodFlag) if (bloodTree.Parent[0] || bloodTree.Parent[1]) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;

        drawHalf(context, 270, 60, 220, 90, width, colorLine, false, dashLength);
        drawHalfUp(context, 185, 90, 160, 100, width, colorLine, false, dashLength);
        drawLine(context, 185, 90, 220, 90, width, colorLine, false, dashLength);

        if (tree.Brothers.length > 1) {
            drawLine(context, 75, 90, 185, 90, width, colorLine, false, dashLength);
            drawHalfUp(context, 75, 90, 50, 100, width, colorLine, false, dashLength);
        }

        if (colorLine == colorBlood) colorLine = colorBloodMuted; else colorLine = colorDefault;

        if (tree.Brothers.length > 2) {
            drawLine(context, 75, 90, 10, 90, width, colorLine, true, dashLength);
        }
    }

    // Есть ли родитель
    for (var i = 0; i < 4; i++) {
        if (i % 2 == 0) {
            // Если нет жены
            if (i == 2 && tree.Wifes == null) {
                break;
            }

            if (arrParent[i] != null) {
                if (bloodFlag) if (bloodTree.Parent[i]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;
                draw(context, 125 + 600 * i / 2, 0, 270 + 605 * i / 2, 60, width, colorLine, false, dashLength, false);
            }
            else {
                draw(context, 125 + 600 * i / 2, 0, 270 + 605 * i / 2, 60, width, colorMuted, true, dashLength, false);
            }
        } else {
            if (arrParent[i] != null) {
                if (bloodFlag) if (bloodTree.Parent[i]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;
                draw(context, 425 + 600 * (i - 1) / 2, 0, 270 + 605 * (i - 1) / 2, 60, width, colorLine, false, dashLength, true);
            }
            else {
                draw(context, 425 + 600 * (i - 1) / 2, 0, 270 + 605 * (i - 1) / 2, 60, width, colorMuted, true, dashLength, true);
            }
        }
    }

    for (var i = 0; i < 2; i++) {
        // Если нет жены
        if (i == 1 && tree.Wifes == null) {
            break;
        }
        if (arrParent[i * 2] == null && arrParent[i * 2 + 1] == null) {
            if (bloodFlag) if (bloodTree.Parent[i * 2] || bloodTree.Parent[i * 2 + 1]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;
            drawLine(context, 270 + 605 * i, 60, 270 + 605 * i, 100, width, colorLine, true, dashLength);
        } else {
            if (bloodFlag) if (bloodTree.Parent[i * 2] || bloodTree.Parent[i * 2 + 1]) colorLine = colorBlood; else colorLine = colorDefault;
            else colorLine = colorDefault;
            drawLine(context, 270 + 605 * i, 60, 270 + 605 * i, 100, width, colorLine, false, dashLength);
        }
    }

    var tail = -125;

    for (var i = 0; i < 4; i++) {
        if (i % 2 == 0) {
            tail += 200;
        } else {
            tail += 400;
        }
        if (tree.Parent_has_another_child[i] == true) {
            if (bloodFlag) if (bloodTree.Parent[i]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;
            drawHalf(context, 125 + 300 * i, 0, tail, 30, width, colorLine, true, dashLength);
        }
    }

    // Three
    // Есть ли у второй жены родитель
    if (tree.Wife_2_has_parent) {
        if (bloodFlag) if (bloodTree.Wifes[1]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(context, 1100, 75, 1100, 100, width, colorLine, true, dashLength);
    }

    /// canvas 3 ///
    canvas = document.getElementById("canvas3");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // One
    // Есть ли дети у жен от других браков
    if (tree.Wife_has_another_child != null) {
        for (var i = 0; i < 2; i++) {
            if (tree.Wife_has_another_child[i]) {
                if (bloodFlag) if (bloodTree.Wifes[i]) colorLine = colorBloodMuted; else colorLine = colorMuted;
                else colorLine = colorMuted;
                drawHalf(context, 875 + i * 225, 0, 925 + i * 225, 30, width, colorLine, true, dashLength);
            }
        }
    }

    // Есть вторая жена и ребенок от нее
    if (tree.ChildWife_2 != null) {
        if (bloodFlag) if (bloodTree.Main) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(context, 450, 40, 950, 40, width, colorLine, false, dashLength);
        drawHalfUp(context, 950, 40, 988, 80, width, colorLine, false, dashLength);

        if (bloodFlag) if (bloodTree.Wifes[1]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        draw(context, 1100, 0, 988, 80, width, colorLine, false, dashLength, true);

        if (bloodFlag) if (bloodTree.Main || bloodTree.Wifes[1]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(context, 988, 80, 988, 120, width, colorLine, false, dashLength);


        // Количество детей у 2-й жены больше 1
        if (tree.CountChildrenWife_2) {
            if (bloodFlag) if (bloodTree.Wifes[1]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;
            drawHalf(context, 988, 80, 938, 110, width, colorLine, true, dashLength);
        }

        // Есть ли ребенок от 3-й жены
        if (tree.Child_Wife_3) {
            if (bloodFlag) if (bloodTree.Main) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;

            drawLine(context, 950, 40, 1150, 40, width, colorLine, true, dashLength);
        }
    }

    // Two       
    if (tree.Children == null) {
        draw(context, 270, 0, 575, 80, width, colorMuted, true, dashLength, false);
        draw(context, 875, 0, 575, 80, width, colorMuted, true, dashLength, true);
        drawLine(context, 575, 80, 575, 120, width, colorMuted, true, dashLength);
    } else {

        if (bloodFlag) if (bloodTree.Main) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;
        draw(context, 270, 0, 575, 80, width, colorLine, false, dashLength, false);

        if (bloodFlag) if (bloodTree.Children[0]) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;
        drawLine(context, 575, 80, 575, 120, width, colorLine, false, dashLength);

        if (tree.Wifes == null) {
            draw(context, 875, 0, 575, 80, width, colorMuted, true, dashLength, true);
        } else {
            if (bloodFlag) if (bloodTree.Wifes[0]) colorLine = colorBlood; else colorLine = colorDefault;
            else colorLine = colorDefault;
            draw(context, 875, 0, 575, 80, width, colorLine, false, dashLength, true);
        }
    }

    if (tree.Children != null) {
        if (bloodFlag) if (bloodTree.Children[0]) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;

        if (tree.Children.length > 1) {
            drawHalf(context, 575, 80, 525, 110, width, colorLine, false, dashLength);
            drawHalfUp(context, 490, 110, 465, 120, width, colorLine, false, dashLength);
            drawLine(context, 490, 110, 525, 110, width, colorLine, false, dashLength);
        }

        if (tree.Children.length > 2) {
            drawHalfUp(context, 380, 110, 355, 120, width, colorLine, false, dashLength);
            drawLine(context, 380, 110, 490, 110, width, colorLine, false, dashLength);
        }

        if (tree.Children.length > 3) {
            if (colorLine == colorBlood) colorLine = colorBloodMuted; else colorLine = colorMuted;
            drawLine(context, 315, 110, 380, 110, width, colorLine, true, dashLength);
        }
    }


    // Three
    // Есть ли у братьев дети

    if (tree.BrothersSons != null && tree.BrothersSons.length > 0) {
        if (bloodFlag) if (bloodTree.Main) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;

        if (tree.BrothersSons[0]) {
            drawLine(context, 160, 0, 160, 35, width, colorLine, true, dashLength);
        }
        if (tree.BrothersSons.length > 1) {
            if (tree.BrothersSons[1]) {
                drawLine(context, 50, 0, 50, 35, width, colorLine, true, dashLength);
            }
        }
    }

    /// canvas 4 ///
    canvas = document.getElementById("canvas4");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (tree.Children != null) {
        if (bloodFlag) if (bloodTree.Children[0]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;


        var i = 2;
        switch (tree.Children.length) {
            case 1: i = 2; break;
            case 2: i = 1; break;
            case 3: i = 0; break;
            default: i = 0;
        }
        if (tree.Child_has_sons[0]) {
            drawLine(context, 355 + i * 110, 0, 355 + i * 110, 35, width, colorLine, true, dashLength);
        }
        if (tree.Children.length > 1 && tree.Child_has_sons[1]) {
            drawLine(context, 465 + i * 110, 0, 465 + i * 110, 35, width, colorLine, true, dashLength);
        }
        if (tree.Children.length > 2 && tree.Child_has_sons[2]) {
            drawLine(context, 575, 0, 575, 35, width, colorLine, true, dashLength);
        }
    }

    if (tree.Child_Another_has_sons) {
        if (bloodFlag) if (bloodTree.AnotherChild) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(context, 988, 0, 988, 35, width, colorLine, true, dashLength);
    }
}

function DrawConntecionsLittleTree(tree, blood) {
    ////////////////////////////////////////
    ////// Увеличенный масштаб дерева //////
    ////////////////////////////////////////

    var colorDefault = "#0080FF"; // Основной
    var colorBlood = "#900000"; // Кровавый
    var colorMuted = "#90B2D5"; // Основной приглушенный
    var colorBloodMuted = "#904949"; // Кровавый приглушенный
    var colorLine = colorDefault;
    var width = 5;
    var dashLength = 18;

    var arrGrand = [
        tree.Grand_1_1, tree.Grand_1_2, tree.Grand_2_1, tree.Grand_2_2
    ];
    var arrParent = [
        tree.Parent_1, tree.Parent_2, tree.Parent_W_1, tree.Parent_W_2
    ];

    /// canvas 5 ///
    canvas = document.getElementById("canvas5");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (arrGrand[0] != null || arrGrand[1] != null) {
        if (bloodFlag) if (bloodTree.Parent[0]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(context, 100, 50, 100, 100, width, colorLine, true, dashLength);
    }
    if (arrGrand[2] != null || arrGrand[3] != null) {
        if (bloodFlag) if (bloodTree.Parent[1]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(context, 926, 50, 926, 100, width, colorLine, true, dashLength);
    }
    /// canvas 6 ///
    canvas = document.getElementById("canvas6");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Есть ли родитель
    for (var i = 0; i < 2; i++) {
        if (i % 2 == 0) {

            if (arrParent[i] != null) {
                if (bloodFlag) if (bloodTree.Parent[0]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;
                draw(context, 100, 0, 513, 120, width, colorLine, false, dashLength, false);
            }
            else {
                draw(context, 100, 0, 513, 120, width, colorMuted, true, dashLength, false);
            }
        } else {
            if (arrParent[i] != null) {
                if (bloodFlag) if (bloodTree.Parent[1]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;
                draw(context, 926, 0, 513, 120, width, colorLine, false, dashLength, true);
            }
            else {
                draw(context, 926, 0, 513, 120, width, colorMuted, true, dashLength, true);
            }
        }
    }

    if (arrParent[0] == null && arrParent[1] == null) {
        drawLine(context, 513, 120, 513, 200, width, colorMuted, true, dashLength);
    } else {
        if (bloodFlag) if (bloodTree.Parent[0] || bloodTree.Parent[1]) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;
        drawLine(context, 513, 120, 513, 200, width, colorLine, false, dashLength);
    }

    for (var i = 0; i < 2; i++) {
        if (tree.Parent_has_another_child[i] == true) {
            if (bloodFlag) if (bloodTree.Parent[i]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;
            drawHalf(context, 100 + 826 * i, 0, 0 + 1026 * i, 60, width, colorLine, true, dashLength);
        }
    }

    // Братья
    if (tree.Brothers != null && tree.Brothers.length > 0) {
        if (bloodFlag) if (bloodTree.Main) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        if (tree.Brothers.length > 1) {
            drawLine(context, 215, 180, 313, 180, width, colorLine, true, dashLength);
        }

        if (bloodFlag) if (bloodTree.Main) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;

        drawHalf(context, 513, 120, 413, 180, width, colorLine, false, dashLength);
        drawHalfUp(context, 333, 180, 283, 200, width, colorLine, false, dashLength);
        drawLine(context, 333, 180, 413, 180, width, colorLine, false, dashLength);
    }

    // Есть ли у жены родитель
    if (arrParent[2] != null || arrParent[3] != null) {
        if (bloodFlag) if (bloodTree.Wifes[0]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(context, 863, 150, 863, 200, width, colorLine, true, dashLength);
    }

    /// canvas 7 ///
    canvas = document.getElementById("canvas7");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Дети        
    if (tree.Children == null) {
        draw(context, 513, 0, 690, 120, width, colorMuted, true, dashLength, false);
        draw(context, 863, 0, 690, 120, width, colorMuted, true, dashLength, true);
        drawLine(context, 690, 120, 690, 200, width, colorMuted, true, dashLength);
    } else {
        if (bloodFlag) if (bloodTree.Main) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;
        draw(context, 513, 0, 690, 120, width, colorLine, false, dashLength, false);

        if (bloodFlag) if (bloodTree.Main || bloodTree.Wifes[0]) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;
        drawLine(context, 690, 120, 690, 200, width, colorLine, false, dashLength);

        if (tree.Wifes == null) {
            draw(context, 863, 0, 690, 120, width, colorMuted, true, dashLength, true);
        } else {
            if (bloodFlag) if (bloodTree.Wifes[0]) colorLine = colorBlood; else colorLine = colorDefault;
            else colorLine = colorDefault;
            draw(context, 863, 0, 690, 120, width, colorLine, false, dashLength, true);
        }
    }

    if (tree.Children != null) {
        if (tree.Children.length > 2) {
            if (bloodFlag) if (bloodTree.Children[0]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;
            drawLine(context, 392, 180, 490, 180, width, colorLine, true, dashLength);
        }

        if (tree.Children.length > 1) {
            if (bloodFlag) if (bloodTree.Children[0]) colorLine = colorBlood; else colorLine = colorDefault;
            else colorLine = colorDefault;
            drawHalf(context, 690, 120, 590, 180, width, colorLine, false, dashLength);
            drawHalfUp(context, 510, 180, 460, 200, width, colorLine, false, dashLength);
            drawLine(context, 510, 180, 590, 180, width, colorLine, false, dashLength);
        }
    }

    // Есть ли у братьев дети

    if (tree.BrothersSons != null && tree.BrothersSons.length > 0) {
        if (tree.BrothersSons[0]) {
            if (bloodFlag) if (bloodTree.Brothers[0]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;
            drawLine(context, 283, 0, 283, 50, width, colorLine, true, dashLength);
        }
    }
    /// canvas 8 ///
    canvas = document.getElementById("canvas8");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (tree.Children != null) {
        if (bloodFlag) if (bloodTree.Children[0]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;

        var i = 1;
        switch (tree.Children.length) {
            case 1: i = 1; break;
            case 2: i = 0; break;
            default: i = 0;
        }
        if (tree.Child_has_sons[0]) {
            drawLine(context, 460 + i * 230, 0, 460 + i * 230, 50, width, colorLine, true, dashLength);
        }
        if (tree.Children.length > 1 && tree.Child_has_sons[1]) {
            drawLine(context, 690, 0, 690, 50, width, colorLine, true, dashLength);
        }
    }
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

function ShowModalPerson(event) {

    if (event.currentTarget.firstElementChild.classList[1] == "hiddenPersonContent") {
        return;
    }

    var Rect = event.currentTarget.getBoundingClientRect();
    var modalPerson = $("#modalBlockPerson")[0];
    var surname = $(event.currentTarget).find(".surname")[0];
    var name = $(event.currentTarget).find(".name")[0];
    var middleName = $(event.currentTarget).find(".middlename")[0];
    // Дополнение: получение даты рождения для вывода в карточке человека.
    var birthday = $(event.currentTarget).find(".birthday")[0];
    // Дополнение: получение даты рождения для вывода в карточке человека.
    var textModal = $("#textModal")[0];
    var person = $("#mainPerson")[0];
    var currentId = event.currentTarget.getAttribute("data-value");
    var idPerson = 0;

    if (bloodFlag) {
        idPerson = $("#BloodTree")[0].getAttribute("data-value");
    }
    else {
        idPerson = person.getAttribute("data-value");
    }

    $("#editPersonModal").attr("data-id", currentId);

    _deletePersonId = currentId;

    $.ajax({
        type: 'GET',
        dataType: 'text',
        data: {
            treeId: _currentFamilyTree.Id,
            targetPersonId: idPerson,
            personId: currentId
        },
        url: '/People/GetRelationsByPeopleIds',
        success: function (result) {
            textModal.innerText = "Дата рождения: " + birthday.innerText +"\n" + result;
            // Дополнение: вывод даты рождения в карточке человека.
            modalPerson.firstElementChild.firstElementChild.innerText = surname.innerText + " " + name.innerText + " " + middleName.innerText;
            // Дополнение: вывод даты рождения в карточке человека.
            var modalRect = modalPerson.getBoundingClientRect();

            modalPerson.style.left = (Rect.left + Rect.width / 2 - modalRect.width / 2 + pageXOffset) + "px";
            modalPerson.style.top = (Rect.top - modalRect.height + pageYOffset + 0) + "px";

            modalPerson.style.visibility = "visible";
            visibleModal = false;
        }
    });
    /* // Дополнение: старая версия верхнего $.ajax({...})
    $.ajax({
        type: 'GET',
        dataType: 'text',
        data: {
            treeId: _currentFamilyTree.Id,
            targetPersonId: idPerson,
            personId: currentId
        },
        url: '/People/GetLifeYearsByPersonId',
        success: function (result) {
            textModal.innerText = +result;
            modalPerson.firstElementChild.firstElementChild.innerText = surname.innerText + " " + name.innerText + " " + middleName.innerText;

            var modalRect = modalPerson.getBoundingClientRect();

            modalPerson.style.left = (Rect.left + Rect.width / 2 - modalRect.width / 2 + pageXOffset) + "px";
            modalPerson.style.top = (Rect.top - modalRect.height + pageYOffset + 0) + "px";

            modalPerson.style.visibility = "visible";
            visibleModal = false;
        }
    });
    */ // Дополнение: старая версия верхнего $.ajax({...})
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

// Функция Перерисовки, есть ли у детей ребенок
function RedrawSonsHasSonConnections(CurrentElem, VisibleCount, canvas, width, dashLength) {
    // CurrentItem - текущий элемент в слайдере детей
    // VisibleCount - количество видимых детей на слайдере (2 - увеличенный масштаб дерева, 3 - обычное дерево)
    var colorMuted = "#90B2D5"; // Приглушенный
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height); // Очистка контекста для перерисовки

    var indexElem = 0;
    // Получение индекса элемента в массиве детей
    for (var i = 0; i < mainTree.Children.length; i++) {
        if (mainTree.Children[i].Id == $(CurrentElem.firstElementChild)[0].getAttribute("data-value")) {
            indexElem = i;
            break;
        }
    }

    // Функция получения следующего индекса (по кругу)
    function GetNextIndexElem(indexElem, arrLength) {
        if (indexElem == arrLength - 1) {
            return 0;
        } else {
            indexElem++;
            return indexElem;
        }
    }

    var arrHasSons = Array(VisibleCount); // Массив, есть ли у детей ребенок
    arrHasSons[0] = mainTree.Child_has_sons[indexElem]; // Установление первого значения

    indexElem = GetNextIndexElem(indexElem, mainTree.Child_has_sons.length);
    arrHasSons[1] = mainTree.Child_has_sons[indexElem]; // Установление второго значения

    if (VisibleCount == 3) {
        indexElem = GetNextIndexElem(indexElem, mainTree.Child_has_sons.length);
        arrHasSons[2] = mainTree.Child_has_sons[indexElem]; // Установление третьего значения
    }

    // Draw // 
    for (var k = 0; k < arrHasSons.length; k++) {
        if (arrHasSons[k]) {
            if (VisibleCount == 3) {
                drawLine(context, 355 + k * 110, 0, 355 + k * 110, 35, width, colorMuted, true, dashLength);
            } else {
                drawLine(context, 460 + k * 230, 0, 460 + k * 230, 50, width, colorMuted, true, dashLength);
            }
        }
    }
}

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

function DrawBlood(idWife) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {
            id: _currentFamilyTree.Id,
            bloodMainId: $("#BloodTree")[0].getAttribute("data-value"),
            currentMainId: $("#mainPerson")[0].getAttribute("data-value"),
            wifeId: idWife
        },
        url: '/FamilyTree/GetBloodTree',
        success: function (result) {
            bloodTree = result;
            DrawConnections(mainTree);
            DrawConntecionsLittleTree(mainTree);
        }
    });
}

// Добавление человека
function AddNewPerson(event) {

    var id = event.currentTarget.id;
    id = id.replace("-LittleTree", "");
    var idSend = "";
    var idWifeForChild = 0;

    if (id != "wifeOne" && id != "sonOne") {
        _createPersonData.PersonRelationType = PersonRelationTypes.Parent;
        var arr1 = ["blood-grandOne", "blood-grandThree", "blood-parentOne", "parentOne", "grandOne", "grandThree"];
        var arr2 = ["blood-grandTwo", "blood-grandFour", "blood-parentTwo", "parentTwo", "grandTwo", "grandFour"];
        var arr3 = ["blood-parentOne", "blood-parentTwo", "mainPerson", "wifeOne", "parentOne", "parentTwo"];

        var index;

        if (arr1.includes(id)) {
            _createPersonData.ParentNumber = 1;
            index = arr1.indexOf(id);
        }
        if (arr2.includes(id)) {
            _createPersonData.ParentNumber = 2;
            index = arr2.indexOf(id);
        }

        if (index == 3) {
            idSend = $("#wifes .itemCurrent")[0].firstElementChild.getAttribute("data-value");
        } else {
            idSend = $("#" + arr3[index])[0].getAttribute("data-value");
        }

    } else {
        if (id == "wifeOne") {
            _createPersonData.PersonRelationType = PersonRelationTypes.Lover;
        }
        if (id == "sonOne") {
            _createPersonData.PersonRelationType = PersonRelationTypes.Child;
            if (!$("#wifeOne")[0].classList.contains("newPerson")) {
                idWifeForChild = $("#wifes .itemCurrent")[0].firstElementChild.getAttribute("data-value");
            }
        }
        idSend = $("#mainPerson")[0].getAttribute("data-value");
    }

    _createPersonData.WifeId = idWifeForChild;
    _createPersonData.MainPersonId = idSend;
    _createPersonData.TreeId = _currentFamilyTree.Id;

    ShowCreatePersonForm();
    ShowMainTree(false);
}

function AddOneMorePerson(event) {
    var id = event.currentTarget.id;
    var idSend = "";
    var idWifeForChild = 0;

    if (id == "blood-newBrother" || id == "addBrother-LittleTree") {
        _createPersonData.PersonRelationType = PersonRelationTypes.Sibling;
    }
    else {
        if (id == "blood-newWife" || id == "addWife-LittleTree") {
            _createPersonData.PersonRelationType = PersonRelationTypes.Lover;
        }
        if (id == "blood-newSon" || id == "AddSon-LittleTree") {
            _createPersonData.PersonRelationType = PersonRelationTypes.Child;
            if (!$("#wifeOne")[0].classList.contains("newPerson")) {
                idWifeForChild = $("#wifes .itemCurrent")[0].firstElementChild.getAttribute("data-value");
            }
        }
    }

    idSend = $("#mainPerson")[0].getAttribute("data-value");

    _createPersonData.WifeId = idWifeForChild;
    _createPersonData.MainPersonId = idSend;
    _createPersonData.TreeId = _currentFamilyTree.Id;

    ShowCreatePersonForm();
    ShowMainTree(false);
}