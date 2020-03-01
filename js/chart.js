
function DrawChart(data, containerSelector, labels = GenerateLabels(data[0])) {
    const dataToDraw = {
        labels: labels,
        series: data
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