
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