$(function () {

    $('#launchAppButton').on('click', function () {
        LaunchApp();
    });

    LaunchApp();
});

function LaunchApp()
{
    const input = $('#inputData').val();
    const data = ConvertToNumericArray(GetArrayFromText(input));

    window.presicion = $('#precision').val();
    window.forecastCount = $('#forecastCount').val();

    DoSesearchOfTimeSeries(data);
    DoResearchOfTrend(data);
    ShowModels(data);
}

function DoSesearchOfTimeSeries (data) {
    DrawChart([data], '#inputDataChart');
    PrintTableBody('#mainIndicatorsOfTheDynamic',
        [
            GenerateLabels(data),
            data,
            GetChainAbsoluteIncrease(data),
            GetBaseAbsoluteIncrease(data),
            GetChainGrowthRate(data),
            GetBaseGrowthRate(data),
            GetChainUpGrowthRate(data),
            GetBaseUpGrowthRate(data)
        ],
        data.length);

    $('#dataLength').html(data.length);
    $('#averageIncrease').html(GetAverageIncrease(data));
    $('#averageGrowthRate').html(GetAverageGrowthRate(data));
    $('#averageUpGrowthRate').html(GetAverageUpGrowthRate(data));

    PrintTableBody('#forecastTable',
        [
            GenerateNumberArray(data.length, data.length + forecastCount - 1),
            GetForecastByAverageIncrease(data),
            GetForecastByAverageGrowthRate(data)
        ], forecastCount);
}

function DoResearchOfTrend(data) {
    const median = GetMedian(data);
    const signArray = GetSignArray(data, median);

    PrintTableBody('#signArrayTable',
        [
            GenerateLabels(data),
            data,
            signArray
        ], data.length);

    const seriesCount = GetSeriesCount(data);
    const maxSeriesLength = GetMaxSeriesLength(data);
    const maxSeriesCriterion = GetMaxSeriesCriterion(data.length);
    const minSeriesCount = GetMinSeriesCount(data.length);

    $('#mediana').html(median);
    $('#seriesCount').html(seriesCount);
    $('#maxSeriesLength').html(maxSeriesLength);
    $('#maxSeriesCriterion').html(maxSeriesCriterion);
    $('#minSeriesCount').html(minSeriesCount);

    if (seriesCount > minSeriesCount && maxSeriesLength < maxSeriesCriterion)
    {
        $('#medianMethodReview').html('с вероятность 95% гипотеза о наличии тренда не отвергается');
    }
    else
    {
        $('#medianMethodReview').html('гипотеза об отсутствии тренда отвергается с вероятностью ошибки 5%');
    }
}

function ShowModels(data) {
    ShowLinearNonCenteredModel(data);
    ShowLinearCenteredModel(data);
    ShowParabolicModel(data);
}

function ShowLinearNonCenteredModel(data) {
    const tArray = GenerateLabels(data);

    const tSum = tArray.reduce((a, b) => a + b);
    const yOfTSum = data.reduce((a, b) => a + b);
    const yOfTonTSum = MultiplyArrays(tArray, data).reduce((a, b) => a + b);
    const tOnTSum = MultiplyArrays(tArray, GenerateLabels(data)).reduce((a, b) => a + b);

    const a1 = (data.length * yOfTonTSum - yOfTSum * tSum) / (data.length * tOnTSum - Math.pow(tSum, 2));
    const a0 = yOfTSum / data.length - a1 * tSum / data.length;

    PrintTableBody('#linearNonCenteredModelData', [
        GenerateLabels(data),
        data,
        MultiplyArrays(tArray, data),
        MultiplyArrays(tArray, tArray)
    ], data.length);

    $('#linearNonCenteredModelTSum').html(tSum);
    $('#linearNonCenteredModelYOfTSum').html(yOfTSum);
    $('#linearNonCenteredModelYOfTonTSum').html(yOfTonTSum.toFixed(presicion));
    $('#linearNonCenteredModelTOnTSum').html(tOnTSum.toFixed(presicion));
    $('#linearNonCenteredModelA1').html(a1.toFixed(presicion));
    $('#linearNonCenteredModelA0').html(a0.toFixed(presicion));
    $('#linearNonCenteredModel').html(`y = ${a1.toFixed(presicion)} * x + ${a0.toFixed(presicion)}`);

    DrawChart([data, tArray.map(item => a1 * item + a0)], '#linearNonCenteredModelChart');
}

function ShowLinearCenteredModel(data) {
    let seriesStart;
    if (data.length % 2 == 0)
    {
        seriesStart = data.length / 2;
    }
    else
    {
        seriesStart = (data.length - 1) / 2;
    }

    const tArray = GenerateNumberArray(-seriesStart, data.length - seriesStart - 1);

    const tSum = tArray.reduce((a, b) => a + b);
    const yOfTSum = data.reduce((a, b) => a + b);
    const yOfTonTSum = MultiplyArrays(tArray, data).reduce((a, b) => a + b);
    const tOnTSum = MultiplyArrays(tArray, GenerateLabels(data)).reduce((a, b) => a + b);

    const a1 = (data.length * yOfTonTSum - yOfTSum * tSum) / (data.length * tOnTSum - Math.pow(tSum, 2));
    const a0 = yOfTSum / data.length - a1 * tSum / data.length;

    PrintTableBody('#linearCenteredModelData', [
        tArray,
        data,
        MultiplyArrays(tArray, data),
        MultiplyArrays(tArray, tArray)
    ], data.length);

    $('#linearCenteredModelTSum').html(tSum);
    $('#linearCenteredModelYOfTSum').html(yOfTSum);
    $('#linearCenteredModelYOfTonTSum').html(yOfTonTSum.toFixed(presicion));
    $('#linearCenteredModelTOnTSum').html(tOnTSum.toFixed(presicion));
    $('#linearCenteredModelA1').html(a1.toFixed(presicion));
    $('#linearCenteredModelA0').html(a0.toFixed(presicion));
    $('#linearCenteredModel').html(`y = ${a1.toFixed(presicion)} * x + ${a0.toFixed(presicion)}`);

    DrawChart([data, tArray.map(item => a1 * item + a0)], '#linearCenteredModelChart', tArray);
}

function ShowParabolicModel(data) {
    const tArray = GenerateLabels(data);

    const tSum = tArray.reduce((a, b) => a + b);
    const yOfTSum = data.reduce((a, b) => a + b);
    const yOfTonTSum = MultiplyArrays(tArray, data).reduce((a, b) => a + b);
    const tOnTSum = MultiplyArrays(tArray, GenerateLabels(data)).reduce((a, b) => a + b);
    const yOfTOnTonTSum = MultiplyArrays(data, MultiplyArrays(tArray, tArray)).reduce((a, b) => a + b);
    const tIn4Sum = tArray.map(item => Math.pow(item, 4)).reduce((a, b) => a + b);

    const a2 = (data.length * yOfTOnTonTSum - yOfTSum * tOnTSum) / (data.length * tIn4Sum - Math.pow(tOnTSum, 2));
    const a1 = yOfTonTSum / tOnTSum;
    const a0 = yOfTSum / data.length - a2 * tOnTSum / data.length;

    PrintTableBody('#parabolicModelData', [
        GenerateLabels(data),
        data,
        MultiplyArrays(tArray, data),
        MultiplyArrays(tArray, tArray),
        MultiplyArrays(data, MultiplyArrays(tArray, tArray)),
        tArray.map(item => Math.pow(item, 4))
    ], data.length);

    $('#parabolicModelTSum').html(tSum);
    $('#parabolicModelYOfTSum').html(yOfTSum);
    $('#parabolicModelYOfTonTSum').html(yOfTonTSum.toFixed(presicion));
    $('#parabolicModelTOnTSum').html(tOnTSum.toFixed(presicion));
    $('#parabolicModelA2').html(a2.toFixed(presicion));
    $('#parabolicModelA1').html(a1.toFixed(presicion));
    $('#parabolicModelA0').html(a0.toFixed(presicion));
    $('#parabolicModel2').html(`y = ${a2.toFixed(presicion)} * x ^ 2 + ${a1.toFixed(presicion)} * x + ${a0.toFixed(presicion)}`);

    DrawChart([data, tArray.map(item => a2 * Math.pow(item, 2) + a1 * item + a0)], '#parabolicModel2Chart');
}
