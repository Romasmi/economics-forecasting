
function DoSmoothingByMovingAverage(data) {

    const simpleSmoothing3 = GetDataByMovingAverageMethod(data, 3);
    const simpleSmoothing4 = GetDataByMovingAverageMethod(data, 4);
    const simpleSmoothing5 = GetDataByMovingAverageMethod(data, 5);

    DrawChart([data, simpleSmoothing3], '#simpleSmoothing3');
    DrawChart([data, simpleSmoothing4], '#simpleSmoothing4');
    DrawChart([data, simpleSmoothing5], '#simpleSmoothing5');

    PrintTableBody('#simpleSmoothingTableBody',
        [
            GenerateLabels(data),
            data,
            simpleSmoothing3,
            simpleSmoothing4,
            simpleSmoothing5
        ],
        data.length);

    DoResearchOfTimeSeries(simpleSmoothing3,'#researchOfTimeSeriesSS3');
    DoResearchOfTimeSeries(simpleSmoothing4,'#researchOfTimeSeriesSS4');
    DoResearchOfTimeSeries(simpleSmoothing5,'#researchOfTimeSeriesSS5');
}

function DoSmoothingByMovingWeightedAverage(data) {

    const weightedSmoothing5 = GetDataByMovingWeightedAverageMethod(data, 5, [-3/35, 12/35, 17/35]);
    const weightedSmoothing7 = GetDataByMovingWeightedAverageMethod(data, 7, [-2/21, 3/21, 6/21, 7/21]);
    const weightedSmoothing9 = GetDataByMovingWeightedAverageMethod(data, 9, [-21/231, 14/231, 39/231, 54/231, 59/231]);

    DrawChart([data, weightedSmoothing5], '#weightedSmoothing5');
    DrawChart([data, weightedSmoothing7], '#weightedSmoothing7');
    DrawChart([data, weightedSmoothing9], '#weightedSmoothing9');

    PrintTableBody('#weightedSmoothingResultTableBody',
        [
            GenerateLabels(data),
            data,
            weightedSmoothing5,
            weightedSmoothing7,
            weightedSmoothing9
        ],
        data.length);


    DoResearchOfTimeSeries(weightedSmoothing5,'#researchOfTimeSeriesWS5');
    DoResearchOfTimeSeries(weightedSmoothing7,'#researchOfTimeSeriesWS7');
    DoResearchOfTimeSeries(weightedSmoothing9,'#researchOfTimeSeriesWS9');
}

function GetDataByMovingAverageMethod(data, gInterval) {
    let arr = [];

    const g = isEven(gInterval) ? gInterval + 1 : gInterval;
    const middle = (g + 1) / 2;
    const begin = middle - 1;
    const end = data.length - middle;

    if (isEven(gInterval))
    {
        for (let i = begin; i <= end; ++i)
        {
            arr[i] = (GetSum(data, i - middle + 2, i + middle - 1) +
                data[i - middle + 1] / 2 +
                data[i + middle - 1] / 2) / gInterval;
        }
    }
    else
    {
        for (let i = begin; i <= end; ++i)
        {
            arr[i] = GetSum(data, i - middle + 1, i + middle) / g;
        }
    }

    const startAverageAbsoluteGrowth = GetStartAverageAbsoluteGrowth(data, g);
    for (let i = begin - 1; i >= 0;  --i)
    {
        arr[i] = arr[i + 1] - startAverageAbsoluteGrowth;
    }

    const endAverageAbsoluteGrowth = GetEndAverageAbsoluteGrowth(data, g);
    for (let i = end + 1; i < data.length;  ++i)
    {
        arr[i] = arr[i - 1] + endAverageAbsoluteGrowth;
    }

    SetArrItemsPresicion(arr, presicion);

    return arr;
}

function GetDataByMovingWeightedAverageMethod(data, gInterval, coefficient = []) {
    let arr = [];

    const middle = (gInterval + 1) / 2;
    const begin = middle - 1;
    const end = data.length - middle;

    for (let i = begin; i <= end; ++i)
    {
        arr[i] = GetSumByMultiplying(data, i - middle + 1, i + middle, GenerateArrayByHalf(coefficient));
    }

    const startAverageAbsoluteGrowth = GetStartAverageAbsoluteGrowth(data, gInterval);
    for (let i = begin - 1; i >= 0;  --i)
    {
        arr[i] = arr[i + 1] - startAverageAbsoluteGrowth;
    }

    const endAverageAbsoluteGrowth = GetEndAverageAbsoluteGrowth(data, gInterval);
    for (let i = end + 1; i < data.length;  ++i)
    {
        arr[i] = arr[i - 1] + endAverageAbsoluteGrowth;
    }

    SetArrItemsPresicion(arr, presicion);

    return arr;
}

function GetStartAverageAbsoluteGrowth(data, g) {
    return (data[g - 1] - data[0]) / (g - 1);
}

function GetEndAverageAbsoluteGrowth(data, g) {
    return (data[data.length - 1] - data[data.length - g]) / (g - 1);
}
