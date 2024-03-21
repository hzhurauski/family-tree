

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