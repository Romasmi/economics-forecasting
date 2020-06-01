function GetIrwinMethodData(data) {
    const standardDeviation0 = GetStandardDeviation0(data);
    let array = [];
    array[0] = '-';
    for (let i = 1; i < data.length; ++i) {
        const value = (Math.abs(data[i] - data[i - 1])) / standardDeviation0;
        array.push(value.toFixed(presicion));
    }
    return array;
}

function GetIrwinCriticalNumber(n) {
    return (-229.21 * Math.pow(n, -3) +
            422.39 * Math.pow(n, -2.5) -
            320.96 * Math.pow(n, -2) +
            124.594 * Math.pow(n, -1.5) -
            26.15 * Math.pow(n, -1) +
            4.799 * Math.pow(n, -0.5) +
            0.7029).toFixed(presicion);
}

function CorrectDataByIrwinMethod(irwinData, irwinCriticalNumber) {
    let correctedValuesNumber = [];
    for (i = 1; i < irwinData.length - 1; ++i)
    {
        if (irwinData[i] > irwinCriticalNumber)
        {
            correctedValuesNumber.push(i + 1);
            window.data[i] = (window.data[i - 1] + window.data[i + 1]) / 2;
        }
    }
    return correctedValuesNumber.join(', ');
}

function GetStandardDeviation0(data) {
    const unbiasedDispersion = GetUnbiasedDispersion(data);
    return Math.sqrt(unbiasedDispersion);
}

function GetUnbiasedDispersion(data) {
    const average = GetAverage(data);
    return data.reduce((sum,value) => sum + Math.pow(value - average, 2), 0) / (data.length - 1);
}

function GetAverage(data) {
    return data.reduce((sum,value) => sum + value, 0) / data.length;
}

function GetFosterStewartDeltaD(n) {
    return Math.sqrt(2 * Math.log(n) - 0.8456).toFixed(presicion);
}

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
    for (let i = 1; i < forecastCount; ++i) {
        forecast.push(forecast[i - 1] + parseFloat(GetAverageIncrease(data)));
    }
    return forecast;
}

function GetForecastByAverageGrowthRate(data) {
    let forecast = [(data[data.length - 1] * GetAverageGrowthRate(data) / 100).toFixed(presicion)];
    for (let i = 1; i < forecastCount; ++i) {
        forecast.push((forecast[i - 1] * GetAverageGrowthRate(data) / 100).toFixed(presicion));
    }
    return forecast;
}

function GetMedian(data) {
    let copy = data.slice();
    copy.sort(function (a, b) {
        return a - b;
    });
    let mediana = isEven(copy.length) ? (copy[copy.length / 2 - 1] + copy[copy.length / 2]) / 2 : copy[(copy.length - 1) / 2];
    return mediana.toFixed(presicion);
}

function GetSignArray(data) {
    let array = [];
    const median = GetMedian(data);
    data.forEach(function (item) {
        if (item > median)
        {
            array.push('+');
        }
        else if (item < median)
        {
            array.push('-')
        }
        else
        {
            array.push('nope');
        }
    });
    return array;
}

function GetSeriesCount(data) {
    const signArray = GetSignArray(data);
    let seriesCount = 1;
    let lastSign = signArray[0];
    for (let i = 1; i < signArray.length; ++i)
    {
        if (signArray[i] === 'nope')
        {
            continue;
        }

        if (signArray[i] != lastSign)
        {
            ++seriesCount;
            lastSign = signArray[i];
        }
    }
    return seriesCount;
}

function GetMaxSeriesLength(data) {
    const signArray = GetSignArray(data);
    let maxLength = 0;
    let length = 0;
    let lastSign = signArray[0];
    for (let i = 1; i < signArray.length; ++i)
    {
        if (signArray[i] === 'nope')
        {
            continue;
        }

        if (signArray[i] != lastSign)
        {
            ++seriesCount;
            lastSign = signArray[i];

            if (length > maxLength)
            {
                maxLength = length;
            }
            length = 1;
        }
        else
        {
            ++length;
        }
    }
    return maxLength;
}

function GetMaxSeriesCriterion(n) {
    return parseFloat(Math.abs(3.3 * Math.log10(n + 1)).toFixed(presicion));
}

function GetMinSeriesCount(n) {
    return parseFloat(Math.abs(0.5 * (n + 1 - 1.96 * Math.pow(n - 2, 0.5))).toFixed(presicion));
}
