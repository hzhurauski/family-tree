

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
            textModal.innerText = "Дата рождения: " + birthday.innerText + "\n" + result;
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

