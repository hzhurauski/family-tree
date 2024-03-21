

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