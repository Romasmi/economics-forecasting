
function DrawChart(data, containerSelector) {
    const dataToDraw = {
        labels: GenerateLabels(data),
        series: [
            data
        ]
    };

    new Chartist.Line(containerSelector, dataToDraw);
}

function GenerateLabels(data) {
    return Array.from(Array(data.length).keys()).map(item => item + 1);
}

function GenerateNumberArray(from, to) {
    let array = [];
    for (let i = from; i <= to; ++i)
    {
        array.push(i);
    }
    return array;
}