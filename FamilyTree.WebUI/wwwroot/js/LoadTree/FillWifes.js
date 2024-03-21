
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