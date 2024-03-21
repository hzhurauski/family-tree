

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