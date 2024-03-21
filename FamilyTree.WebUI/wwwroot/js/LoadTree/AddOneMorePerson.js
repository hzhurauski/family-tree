

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