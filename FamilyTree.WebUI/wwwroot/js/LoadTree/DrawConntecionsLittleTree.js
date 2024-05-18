import { draw, drawHalf, drawHalfUp, drawLine } from "./Draw.js";


export function DrawConntecionsLittleTree(tree, blood) {
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
    window.canvas = document.getElementById("canvas5");
    window.context = window.canvas.getContext("2d");
    window.context.clearRect(0, 0, window.canvas.width, window.canvas.height);

    if (arrGrand[0] != null || arrGrand[1] != null) {
        if (window.bloodFlag) if (window.bloodTree.Parent[0]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(window.context, 100, 50, 100, 100, width, colorLine, true, dashLength);
    }
    if (arrGrand[2] != null || arrGrand[3] != null) {
        if (window.bloodFlag) if (window.bloodTree.Parent[1]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(window.context, 926, 50, 926, 100, width, colorLine, true, dashLength);
    }
    /// canvas 6 ///
    window.canvas = document.getElementById("canvas6");
    window.context = window.canvas.getContext("2d");
    window.context.clearRect(0, 0, window.canvas.width, window.canvas.height);

    // Есть ли родитель
    for (var i = 0; i < 2; i++) {
        if (i % 2 == 0) {

            if (arrParent[i] != null) {
                if (window.bloodFlag) if (window.bloodTree.Parent[0]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;
                draw(window.context, 100, 0, 513, 120, width, colorLine, false, dashLength, false);
            }
            else {
                draw(window.context, 100, 0, 513, 120, width, colorMuted, true, dashLength, false);
            }
        } else {
            if (arrParent[i] != null) {
                if (window.bloodFlag) if (window.bloodTree.Parent[1]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;
                draw(window.context, 926, 0, 513, 120, width, colorLine, false, dashLength, true);
            }
            else {
                draw(window.context, 926, 0, 513, 120, width, colorMuted, true, dashLength, true);
            }
        }
    }

    if (arrParent[0] == null && arrParent[1] == null) {
        drawLine(window.window.context, 513, 120, 513, 200, width, colorMuted, true, dashLength);
    } else {
        if (window.bloodFlag) if (window.bloodTree.Parent[0] || window.bloodTree.Parent[1]) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;
        drawLine(window.context, 513, 120, 513, 200, width, colorLine, false, dashLength);
    }

    for (var i = 0; i < 2; i++) {
        if (tree.Parent_has_another_child[i] == true) {
            if (window.bloodFlag) if (window.bloodTree.Parent[i]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;
            drawHalf(window.context, 100 + 826 * i, 0, 0 + 1026 * i, 60, width, colorLine, true, dashLength);
        }
    }

    // Братья
    if (tree.Brothers != null && tree.Brothers.length > 0) {
        if (window.bloodFlag) if (window.bloodTree.Main) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        if (tree.Brothers.length > 1) {
            drawLine(window.context, 215, 180, 313, 180, width, colorLine, true, dashLength);
        }

        if (window.bloodFlag) if (window.bloodTree.Main) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;

        drawHalf(window.context, 513, 120, 413, 180, width, colorLine, false, dashLength);
        drawHalfUp(window.context, 333, 180, 283, 200, width, colorLine, false, dashLength);
        drawLine(window.context, 333, 180, 413, 180, width, colorLine, false, dashLength);
    }

    // Есть ли у жены родитель
    if (arrParent[2] != null || arrParent[3] != null) {
        if (window.bloodFlag) if (window.bloodTree.Wifes[0]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(window.context, 863, 150, 863, 200, width, colorLine, true, dashLength);
    }

    /// canvas 7 ///
    window.canvas = document.getElementById("canvas7");
    window.context = window.canvas.getContext("2d");
    window.context.clearRect(0, 0, window.canvas.width, window.canvas.height);

    // Дети        
    if (tree.Children == null) {
        draw(window.context, 513, 0, 690, 120, width, colorMuted, true, dashLength, false);
        draw(window.context, 863, 0, 690, 120, width, colorMuted, true, dashLength, true);
        drawLine(window.context, 690, 120, 690, 200, width, colorMuted, true, dashLength);
    } else {
        if (window.bloodFlag) if (window.bloodTree.Main) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;
        draw(window.context, 513, 0, 690, 120, width, colorLine, false, dashLength, false);

        if (window.bloodFlag) if (window.bloodTree.Main || window.bloodTree.Wifes[0]) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;
        drawLine(window.context, 690, 120, 690, 200, width, colorLine, false, dashLength);

        if (tree.Wifes == null) {
            draw(window.context, 863, 0, 690, 120, width, colorMuted, true, dashLength, true);
        } else {
            if (window.bloodFlag) if (window.bloodTree.Wifes[0]) colorLine = colorBlood; else colorLine = colorDefault;
            else colorLine = colorDefault;
            draw(window.context, 863, 0, 690, 120, width, colorLine, false, dashLength, true);
        }
    }

    if (tree.Children != null) {
        if (tree.Children.length > 2) {
            if (window.bloodFlag) if (window.bloodTree.Children[0]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;
            drawLine(window.context, 392, 180, 490, 180, width, colorLine, true, dashLength);
        }

        if (tree.Children.length > 1) {
            if (window.bloodFlag) if (window.bloodTree.Children[0]) colorLine = colorBlood; else colorLine = colorDefault;
            else colorLine = colorDefault;
            drawHalf(window.context, 690, 120, 590, 180, width, colorLine, false, dashLength);
            drawHalfUp(window.context, 510, 180, 460, 200, width, colorLine, false, dashLength);
            drawLine(window.context, 510, 180, 590, 180, width, colorLine, false, dashLength);
        }
    }

    // Есть ли у братьев дети

    if (tree.BrothersSons != null && tree.BrothersSons.length > 0) {
        if (tree.BrothersSons[0]) {
            if (window.bloodFlag) if (window.bloodTree.Brothers[0]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;
            drawLine(window.context, 283, 0, 283, 50, width, colorLine, true, dashLength);
        }
    }
    /// canvas 8 ///
    window.canvas = document.getElementById("canvas8");
    window.context = window.canvas.getContext("2d");
    window.context.clearRect(0, 0, window.canvas.width, window.canvas.height);

    if (tree.Children != null) {
        if (window.bloodFlag) if (window.bloodTree.Children[0]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;

        var i = 1;
        switch (tree.Children.length) {
            case 1: i = 1; break;
            case 2: i = 0; break;
            default: i = 0;
        }
        if (tree.Child_has_sons[0]) {
            drawLine(window.context, 460 + i * 230, 0, 460 + i * 230, 50, width, colorLine, true, dashLength);
        }
        if (tree.Children.length > 1 && tree.Child_has_sons[1]) {
            drawLine(window.context, 690, 0, 690, 50, width, colorLine, true, dashLength);
        }
    }
}