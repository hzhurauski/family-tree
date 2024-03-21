

// Функции рисования
function draw(context, x0, y0, x1, y1, width, color, dash, dashLength, back) {
    if (dash) {
        context.setLineDash([dashLength, 7]);
    } else {
        context.setLineDash([dashLength, 0]);
    }

    if (back) {
        context.strokeStyle = color;
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(x0, y0);
        context.bezierCurveTo(x0 - 10, y1, x1 + 10, y0, x1, y1);
        context.stroke();
    } else {
        context.strokeStyle = color;
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(x0, y0);
        context.bezierCurveTo(x0 + 10, y1, x1 - 10, y0, x1, y1);
        context.stroke();
    }
}

function drawLine(context, x0, y0, x1, y1, width, color, dash, dashLength) {
    if (dash) {
        context.setLineDash([dashLength, 7]);
    } else {
        context.setLineDash([dashLength, 0]);
    }

    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x0, y0);
    context.bezierCurveTo(x0, y0 + (y1 - y0) / 2, x1, y0 + (y1 - y0) / 2, x1, y1);
    context.stroke();
}

function drawHalf(context, x0, y0, x1, y1, width, color, dash, dashLength) {
    if (dash) {
        context.setLineDash([dashLength, 7]);
    } else {
        context.setLineDash([dashLength, 0]);
    }

    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x0, y0);
    context.bezierCurveTo(x0, y1, x1, y1, x1, y1);
    context.stroke();
}

function drawHalfUp(context, x0, y0, x1, y1, width, color, dash, dashLength) {
    if (dash) {
        context.setLineDash([dashLength, 7]);
    } else {
        context.setLineDash([dashLength, 0]);
    }
    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x0, y0);
    context.bezierCurveTo(x1, y0, x1, y1, x1, y1);
    context.stroke();
}

function DrawConnections(tree, blood) {
    var colorDefault = "#0080FF"; // Основной
    var colorBlood = "#900000"; // Кровавый
    var colorMuted = "#90B2D5"; // Основной приглушенный
    var colorBloodMuted = "#904949"; // Кровавый приглушенный
    var colorLine = colorDefault;
    var width = 3;
    var dashLength = 12;
    /// canvas 0 ///
    var canvas = document.getElementById("canvas0");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // One        
    for (var i = 0; i < 8; i++) {
        if (tree.Grand_has_parent[i] == true) {
            if (bloodFlag) if (bloodTree.Grand[i]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;

            drawLine(context, 50 + 150 * i, 15, 50 + 150 * i, 50, width, colorLine, true, dashLength);
        }
    }

    /// canvas 1 ///
    canvas = document.getElementById("canvas1");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Ones
    for (var i = 0; i < 8; i++) {
        if (tree.Grand_has_another_child[i] == true) {
            if (bloodFlag)
                if (bloodTree.Grand[i])
                    colorLine = colorBloodMuted;
                else colorLine = colorMuted;
            else colorLine = colorMuted;

            if (i % 2 == 0) {
                drawHalf(context, 50 + 300 * i / 2, 0, 0 + 300 * i / 2, 30, width, colorLine, true, dashLength);
            } else {
                drawHalf(context, 200 + 300 * (i - 1) / 2, 0, 250 + 300 * (i - 1) / 2, 30, width, colorLine, true, dashLength);
            }
        }
    }

    for (var i = 0; i < 4; i++) {
        if (tree.Parent_has_brother[i] == true) {
            if (bloodFlag) if (bloodTree.Parent[i]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;

            drawHalf(context, 125 + 300 * i, 60, 75 + 300 * i, 90, width, colorLine, true, dashLength);
        }
    }

    var arrGrand = [
        tree.Grand_1_1, tree.Grand_1_2, tree.Grand_2_1, tree.Grand_2_2,
        tree.Grand_W_1_1, tree.Grand_W_1_2, tree.Grand_W_2_1, tree.Grand_W_2_2
    ];
    var arrParent = [
        tree.Parent_1, tree.Parent_2, tree.Parent_W_1, tree.Parent_W_2
    ];

    // Есть ли дедушка
    for (var i = 0; i < 8; i++) {
        if (i % 2 == 0) {
            if (arrGrand[i] != null) {
                if (bloodFlag) if (bloodTree.Grand[i]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;

                draw(context, 50 + 300 * i / 2, 0, 125 + 300 * i / 2, 60, width, colorLine, false, dashLength, false);
            }
            else {
                if (arrParent[Math.trunc(i / 2)] != null) {
                    draw(context, 50 + 300 * i / 2, 0, 125 + 300 * i / 2, 60, width, colorMuted, true, dashLength, false);
                }
            }
        } else {
            if (arrGrand[i] != null) {
                if (bloodFlag) if (bloodTree.Grand[i]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;
                draw(context, 200 + 300 * (i - 1) / 2, 0, 125 + 300 * (i - 1) / 2, 60, width, colorLine, false, dashLength, true);
            }
            else {
                if (arrParent[Math.trunc(i / 2)] != null) {
                    draw(context, 200 + 300 * (i - 1) / 2, 0, 125 + 300 * (i - 1) / 2, 60, width, colorMuted, true, dashLength, true);
                }
            }
        }
    }

    for (var i = 0; i < 4; i++) {
        if (arrParent[i] != null) {
            if (arrGrand[i * 2] == null && arrGrand[i * 2 + 1] == null) {
                drawLine(context, 125 + 300 * i, 60, 125 + 300 * i, 100, width, colorMuted, true, dashLength);
            } else {
                if (bloodFlag) if (bloodTree.Parent[i]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;
                drawLine(context, 125 + 300 * i, 60, 125 + 300 * i, 100, width, colorLine, false, dashLength);
            }
        }
    }

    /// canvas 2 ///
    canvas = document.getElementById("canvas2");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // One
    // Братья
    if (tree.Brothers != null && tree.Brothers.length > 0) {
        if (bloodFlag) if (bloodTree.Parent[0] || bloodTree.Parent[1]) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;

        drawHalf(context, 270, 60, 220, 90, width, colorLine, false, dashLength);
        drawHalfUp(context, 185, 90, 160, 100, width, colorLine, false, dashLength);
        drawLine(context, 185, 90, 220, 90, width, colorLine, false, dashLength);

        if (tree.Brothers.length > 1) {
            drawLine(context, 75, 90, 185, 90, width, colorLine, false, dashLength);
            drawHalfUp(context, 75, 90, 50, 100, width, colorLine, false, dashLength);
        }

        if (colorLine == colorBlood) colorLine = colorBloodMuted; else colorLine = colorDefault;

        if (tree.Brothers.length > 2) {
            drawLine(context, 75, 90, 10, 90, width, colorLine, true, dashLength);
        }
    }

    // Есть ли родитель
    for (var i = 0; i < 4; i++) {
        if (i % 2 == 0) {
            // Если нет жены
            if (i == 2 && tree.Wifes == null) {
                break;
            }

            if (arrParent[i] != null) {
                if (bloodFlag) if (bloodTree.Parent[i]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;
                draw(context, 125 + 600 * i / 2, 0, 270 + 605 * i / 2, 60, width, colorLine, false, dashLength, false);
            }
            else {
                draw(context, 125 + 600 * i / 2, 0, 270 + 605 * i / 2, 60, width, colorMuted, true, dashLength, false);
            }
        } else {
            if (arrParent[i] != null) {
                if (bloodFlag) if (bloodTree.Parent[i]) colorLine = colorBlood; else colorLine = colorDefault;
                else colorLine = colorDefault;
                draw(context, 425 + 600 * (i - 1) / 2, 0, 270 + 605 * (i - 1) / 2, 60, width, colorLine, false, dashLength, true);
            }
            else {
                draw(context, 425 + 600 * (i - 1) / 2, 0, 270 + 605 * (i - 1) / 2, 60, width, colorMuted, true, dashLength, true);
            }
        }
    }

    for (var i = 0; i < 2; i++) {
        // Если нет жены
        if (i == 1 && tree.Wifes == null) {
            break;
        }
        if (arrParent[i * 2] == null && arrParent[i * 2 + 1] == null) {
            if (bloodFlag) if (bloodTree.Parent[i * 2] || bloodTree.Parent[i * 2 + 1]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;
            drawLine(context, 270 + 605 * i, 60, 270 + 605 * i, 100, width, colorLine, true, dashLength);
        } else {
            if (bloodFlag) if (bloodTree.Parent[i * 2] || bloodTree.Parent[i * 2 + 1]) colorLine = colorBlood; else colorLine = colorDefault;
            else colorLine = colorDefault;
            drawLine(context, 270 + 605 * i, 60, 270 + 605 * i, 100, width, colorLine, false, dashLength);
        }
    }

    var tail = -125;

    for (var i = 0; i < 4; i++) {
        if (i % 2 == 0) {
            tail += 200;
        } else {
            tail += 400;
        }
        if (tree.Parent_has_another_child[i] == true) {
            if (bloodFlag) if (bloodTree.Parent[i]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;
            drawHalf(context, 125 + 300 * i, 0, tail, 30, width, colorLine, true, dashLength);
        }
    }

    // Three
    // Есть ли у второй жены родитель
    if (tree.Wife_2_has_parent) {
        if (bloodFlag) if (bloodTree.Wifes[1]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(context, 1100, 75, 1100, 100, width, colorLine, true, dashLength);
    }

    /// canvas 3 ///
    canvas = document.getElementById("canvas3");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // One
    // Есть ли дети у жен от других браков
    if (tree.Wife_has_another_child != null) {
        for (var i = 0; i < 2; i++) {
            if (tree.Wife_has_another_child[i]) {
                if (bloodFlag) if (bloodTree.Wifes[i]) colorLine = colorBloodMuted; else colorLine = colorMuted;
                else colorLine = colorMuted;
                drawHalf(context, 875 + i * 225, 0, 925 + i * 225, 30, width, colorLine, true, dashLength);
            }
        }
    }

    // Есть вторая жена и ребенок от нее
    if (tree.ChildWife_2 != null) {
        if (bloodFlag) if (bloodTree.Main) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(context, 450, 40, 950, 40, width, colorLine, false, dashLength);
        drawHalfUp(context, 950, 40, 988, 80, width, colorLine, false, dashLength);

        if (bloodFlag) if (bloodTree.Wifes[1]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        draw(context, 1100, 0, 988, 80, width, colorLine, false, dashLength, true);

        if (bloodFlag) if (bloodTree.Main || bloodTree.Wifes[1]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(context, 988, 80, 988, 120, width, colorLine, false, dashLength);


        // Количество детей у 2-й жены больше 1
        if (tree.CountChildrenWife_2) {
            if (bloodFlag) if (bloodTree.Wifes[1]) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;
            drawHalf(context, 988, 80, 938, 110, width, colorLine, true, dashLength);
        }

        // Есть ли ребенок от 3-й жены
        if (tree.Child_Wife_3) {
            if (bloodFlag) if (bloodTree.Main) colorLine = colorBloodMuted; else colorLine = colorMuted;
            else colorLine = colorMuted;

            drawLine(context, 950, 40, 1150, 40, width, colorLine, true, dashLength);
        }
    }

    // Two       
    if (tree.Children == null) {
        draw(context, 270, 0, 575, 80, width, colorMuted, true, dashLength, false);
        draw(context, 875, 0, 575, 80, width, colorMuted, true, dashLength, true);
        drawLine(context, 575, 80, 575, 120, width, colorMuted, true, dashLength);
    } else {

        if (bloodFlag) if (bloodTree.Main) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;
        draw(context, 270, 0, 575, 80, width, colorLine, false, dashLength, false);

        if (bloodFlag) if (bloodTree.Children[0]) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;
        drawLine(context, 575, 80, 575, 120, width, colorLine, false, dashLength);

        if (tree.Wifes == null) {
            draw(context, 875, 0, 575, 80, width, colorMuted, true, dashLength, true);
        } else {
            if (bloodFlag) if (bloodTree.Wifes[0]) colorLine = colorBlood; else colorLine = colorDefault;
            else colorLine = colorDefault;
            draw(context, 875, 0, 575, 80, width, colorLine, false, dashLength, true);
        }
    }

    if (tree.Children != null) {
        if (bloodFlag) if (bloodTree.Children[0]) colorLine = colorBlood; else colorLine = colorDefault;
        else colorLine = colorDefault;

        if (tree.Children.length > 1) {
            drawHalf(context, 575, 80, 525, 110, width, colorLine, false, dashLength);
            drawHalfUp(context, 490, 110, 465, 120, width, colorLine, false, dashLength);
            drawLine(context, 490, 110, 525, 110, width, colorLine, false, dashLength);
        }

        if (tree.Children.length > 2) {
            drawHalfUp(context, 380, 110, 355, 120, width, colorLine, false, dashLength);
            drawLine(context, 380, 110, 490, 110, width, colorLine, false, dashLength);
        }

        if (tree.Children.length > 3) {
            if (colorLine == colorBlood) colorLine = colorBloodMuted; else colorLine = colorMuted;
            drawLine(context, 315, 110, 380, 110, width, colorLine, true, dashLength);
        }
    }


    // Three
    // Есть ли у братьев дети

    if (tree.BrothersSons != null && tree.BrothersSons.length > 0) {
        if (bloodFlag) if (bloodTree.Main) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;

        if (tree.BrothersSons[0]) {
            drawLine(context, 160, 0, 160, 35, width, colorLine, true, dashLength);
        }
        if (tree.BrothersSons.length > 1) {
            if (tree.BrothersSons[1]) {
                drawLine(context, 50, 0, 50, 35, width, colorLine, true, dashLength);
            }
        }
    }

    /// canvas 4 ///
    canvas = document.getElementById("canvas4");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (tree.Children != null) {
        if (bloodFlag) if (bloodTree.Children[0]) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;


        var i = 2;
        switch (tree.Children.length) {
            case 1: i = 2; break;
            case 2: i = 1; break;
            case 3: i = 0; break;
            default: i = 0;
        }
        if (tree.Child_has_sons[0]) {
            drawLine(context, 355 + i * 110, 0, 355 + i * 110, 35, width, colorLine, true, dashLength);
        }
        if (tree.Children.length > 1 && tree.Child_has_sons[1]) {
            drawLine(context, 465 + i * 110, 0, 465 + i * 110, 35, width, colorLine, true, dashLength);
        }
        if (tree.Children.length > 2 && tree.Child_has_sons[2]) {
            drawLine(context, 575, 0, 575, 35, width, colorLine, true, dashLength);
        }
    }

    if (tree.Child_Another_has_sons) {
        if (bloodFlag) if (bloodTree.AnotherChild) colorLine = colorBloodMuted; else colorLine = colorMuted;
        else colorLine = colorMuted;
        drawLine(context, 988, 0, 988, 35, width, colorLine, true, dashLength);
    }
}