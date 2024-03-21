



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