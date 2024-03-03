function baseDraw(context, x0, y0, width, color, dash, dashLength, bezierCurveParams) {
    const { x1, y1, x2, y2, x3, y3 } = bezierCurveParams

    if (dash) {
        context.setLineDash([dashLength, 7]);
    } else {
        context.setLineDash([dashLength, 0]);
    }

    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x0, y0);
    context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    context.stroke();
}

export function draw(context, x0, y0, x1, y1, width, color, dash, dashLength, back) {
    
    var bezierCurveParams = {}

    if (back) {
        bezierCurveParams = {
            x1: x0 - 10,
            y1: y1,
            x2: x1 + 10,
            y2: y0,
            x3: x1,
            y3: y1
        }
    } else {
        bezierCurveParams = {
            x1: x0 + 10,
            y1: y1,
            x2: x1 - 10,
            y2: y0,
            x3: x1,
            y3: y1
        }
    }

    baseDraw(context, x0, y0, width, color, dash, dashLength, bezierCurveParams)
}

export function drawLine(context, x0, y0, x1, y1, width, color, dash, dashLength) {
    const bezierCurveParams = {
        x1: x0,
        y1: y0 + (y1 - y0) / 2,
        x2: x1,
        y2: y0 + (y1 - y0) / 2,
        x3: x1,
        y3: y1
    }

    baseDraw(context, x0, y0, width, color, dash, dashLength, bezierCurveParams)
}

export function drawHalf(context, x0, y0, x1, y1, width, color, dash, dashLength) {
    const bezierCurveParams = {
        x1: x0,
        y1: y1,
        x2: x1,
        y2: y1,
        x3: x1,
        y3: y1
    }

    baseDraw(context, x0, y0, width, color, dash, dashLength, bezierCurveParams)
}

export function drawHalfUp(context, x0, y0, x1, y1, width, color, dash, dashLength) {
    const bezierCurveParams = {
        x1: x1,
        y1: y0,
        x2: x1,
        y2: y1,
        x3: x1,
        y3: y1
    }

    baseDraw(context, x0, y0, width, color, dash, dashLength, bezierCurveParams)
}

export const colorDefault = "#0080FF" // Основной
export const colorBlood = "#900000" // Кровавый
export const colorMuted = "#90B2D5" // Основной приглушенный
export const colorBloodMuted = "#904949" // Кровавый приглушенный
export const width = 3
export const widthBig = 5
export const dashLength = 12
export const dashLengthBig = 18
