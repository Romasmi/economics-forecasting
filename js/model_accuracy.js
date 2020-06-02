function getAbsoluteError(data, modelData) {
    let sum = 0;
    for (let i = 0; i < data.length; ++i)
    {
        sum += Math.abs(data[i] - modelData[i]);
    }
    return (sum / data.length).toFixed(presicion);
}

function getApproximationError(data, modelData) {
    let sum = 0;
    for (let i = 0; i < data.length; ++i)
    {
        sum += Math.abs((data[i] - modelData[i]) / data[i]);
    }
    return (sum / data.length * 100).toFixed(presicion);
}

function getRmsError(data, modelData, parametersCount = 2) {
    let sum = 0;
    for (let i = 0; i < data.length; ++i)
    {
        sum += Math.abs(Math.pow(data[i] - modelData[i], 2));
    }
    return (Math.sqrt(sum / (data.length - parametersCount))).toFixed(presicion);
}

function getConclusionByApproximationError(value) {
    let result = '';
    if (value < 10)
    {
        result = 'высокая.';
    }
    else if (value < 20)
    {
        result = 'хорошая.';
    }
    else if (value < 50)
    {
        result = 'удовлетворительная.';
    }
    else
    {
        result = 'неудовлетворительная.';
    }
    return '. Точность ' + result;
}