

function RedrawSonsHasSonConnections(CurrentElem, VisibleCount, canvas, width, dashLength) {
    // CurrentItem - текущий элемент в слайдере детей
    // VisibleCount - количество видимых детей на слайдере (2 - увеличенный масштаб дерева, 3 - обычное дерево)
    var colorMuted = "#90B2D5"; // Приглушенный
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height); // Очистка контекста для перерисовки

    var indexElem = 0;
    // Получение индекса элемента в массиве детей
    for (var i = 0; i < mainTree.Children.length; i++) {
        if (mainTree.Children[i].Id == $(CurrentElem.firstElementChild)[0].getAttribute("data-value")) {
            indexElem = i;
            break;
        }
    }

    // Функция получения следующего индекса (по кругу)
    function GetNextIndexElem(indexElem, arrLength) {
        if (indexElem == arrLength - 1) {
            return 0;
        } else {
            indexElem++;
            return indexElem;
        }
    }

    var arrHasSons = Array(VisibleCount); // Массив, есть ли у детей ребенок
    arrHasSons[0] = mainTree.Child_has_sons[indexElem]; // Установление первого значения

    indexElem = GetNextIndexElem(indexElem, mainTree.Child_has_sons.length);
    arrHasSons[1] = mainTree.Child_has_sons[indexElem]; // Установление второго значения

    if (VisibleCount == 3) {
        indexElem = GetNextIndexElem(indexElem, mainTree.Child_has_sons.length);
        arrHasSons[2] = mainTree.Child_has_sons[indexElem]; // Установление третьего значения
    }

    // Draw // 
    for (var k = 0; k < arrHasSons.length; k++) {
        if (arrHasSons[k]) {
            if (VisibleCount == 3) {
                drawLine(context, 355 + k * 110, 0, 355 + k * 110, 35, width, colorMuted, true, dashLength);
            } else {
                drawLine(context, 460 + k * 230, 0, 460 + k * 230, 50, width, colorMuted, true, dashLength);
            }
        }
    }
}