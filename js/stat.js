function GetChainAbsoluteIncrease(data) {
    let array = [0];
    for (let i = 1; i < data.length; ++i) {
        array.push((data[i] - data[i - 1]).toFixed(presicion));
    }
    return array;
}

function GetBaseAbsoluteIncrease(data) {
    let array = [0];
    const base = data[0];
    for (let i = 1; i < data.length; ++i) {
        array.push((data[i] - base).toFixed(presicion));
    }
    return array;
}

function GetChainGrowthRate(data) {
    let array = [0];
    for (let i = 1; i < data.length; ++i) {
        let growthRate = 0;
            if (data[i - 1] !== 0) {
            growthRate = (data[i - 1] !== 0) ? data[i] / data[i - 1] * 100 : 0;
        }
        array.push(growthRate.toFixed(presicion));
    }
    return array;
}

function GetBaseGrowthRate(data) {
    let array = [0];
    const base = data[0];
    for (let i = 1; i < data.length; ++i) {
        const growthRate = (data[i - 1] !== 0) ? data[i] / base * 100 : 0;
        array.push(growthRate.toFixed(presicion));
    }
    return array;
}

function GetChainUpGrowthRate(data) {
    return GetChainGrowthRate(data).map(item => item !== 0 ? (item - 100).toFixed(presicion) : 0);
}

function GetBaseUpGrowthRate(data) {
    return GetBaseGrowthRate(data).map(item => item !== 0 ? (item - 100).toFixed(presicion) : 0);
}

function GetAverageIncrease(data) {
    return ((data[data.length - 1] - data[0]) / (data.length - 1)).toFixed(presicion);
}

function GetAverageGrowthRate(data) {
    return (Math.pow(data[data.length - 1] / data[0], 1 / (data.length - 1)) * 100).toFixed(presicion);
}

function GetAverageUpGrowthRate(data) {
    return (GetAverageGrowthRate(data) - 100).toFixed(presicion);
}

function GetForecastByAverageIncrease(data) {
    let forecast = [parseFloat(data[data.length - 1]) + parseFloat(GetAverageIncrease(data))];
    for (let i = 1; i < forecastCount; ++i)
    {
        forecast.push(forecast[i - 1] + parseFloat(GetAverageIncrease(data)));
    }
    console.log(forecast);
    return forecast;
}

function GetForecastByAverageGrowthRate(data) {
    let forecast = [(data[data.length - 1] * GetAverageGrowthRate(data) / 100).toFixed(presicion)];
    for (let i = 1; i < forecastCount; ++i)
    {
        forecast.push((forecast[i - 1] * GetAverageGrowthRate(data) / 100).toFixed(presicion));
    }
    return forecast;
}