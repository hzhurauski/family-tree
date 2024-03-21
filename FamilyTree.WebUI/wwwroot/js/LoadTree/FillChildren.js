

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