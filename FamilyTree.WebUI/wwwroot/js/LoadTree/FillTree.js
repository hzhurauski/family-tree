

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