$(function () {
    $('#launchAppButton').on('click', function () {
        LaunchApp();
    });

    LaunchApp();
});

function LaunchApp() {
    const input = $('#inputData').val();

    window.data = ConvertToNumericArray(GetArrayFromText(input));
    window.presicion = $('#precision').val();
    window.forecastCount = $('#forecastCount').val();

    $('.dataCount').html(data.length);

    DoPreliminaryAnalysis(data, '.prelitary-analysis');
    //DoResearchOfTimeSeries(data, '#researchOfTimeSeries');
    //DoResearchOfTrend(data, '#trendChecking');
    //DoSmoothingByMovingAverage(data, '#smoothing');
    ShowModels(data, '#models');
}

function DoPreliminaryAnalysis(data, selector) {
    $(selector).show();

    const dataCopy = data.slice();
    DrawChart([dataCopy], '#inputDataChart');

    const irwinData = GetIrwinMethodData(data);
    const irwinCriticalNumber = GetIrwinCriticalNumber(data.length);
    $('#irwinCriticalNumber').html(irwinCriticalNumber);

    PrintTableBody('#irwinMethodData',
        [
            GenerateLabels(data),
            data,
            irwinData
        ],
        data.length);

    const hasAbnormalValues = !ValuesAreLessThenN(irwinData, irwinCriticalNumber);
    let irwinResultMessage = '';
    if (hasAbnormalValues) {
        const listOfAbnormalValuesList = CorrectDataByIrwinMethod(irwinData, irwinCriticalNumber);
        irwinResultMessage = 'Исходные ряд имеет аномальные значений: ' + listOfAbnormalValuesList + '. Они замененны средними соседних уровней.';
        DrawChart([data], '#correctedInputDataChart');
        $('#correctedData').show();

        PrintTableBody('#correctedDataTable',
            [
                GenerateLabels(data),
                data
            ],
            data.length);
    } else {
        irwinResultMessage = 'Аномальных значений не найдено. Исходный ряд остаётся без изменений.';
    }

    $('#irwinCheckingResultMessage').html(irwinResultMessage);

}

function DoResearchOfTimeSeries(data, sectionSelector) {
    $(sectionSelector).show();

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
            GenerateNumberArray(data.length + 1, data.length + forecastCount),
            GetForecastByAverageIncrease(data),
            GetForecastByAverageGrowthRate(data)
        ], forecastCount);
}

function DoResearchOfTrend(data, selector) {
    $(selector).show();
    DoResearchOfTdendByMedian(data);
    DoResearchOfTrendByFosterStewart(data);
}

function DoResearchOfTdendByMedian(data) {
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

    if (seriesCount > minSeriesCount && maxSeriesLength < maxSeriesCriterion) {
        $('#medianMethodReview').html('с вероятность 95% гипотеза о наличии тренда не отвергается');
    } else {
        $('#medianMethodReview').html('гипотеза об отсутствии тренда отвергается с вероятностью ошибки 5%');
    }

}

function DoResearchOfTrendByFosterStewart(data) {
    let fosterStewartMethodData = CalcDataForFosterStewartMethod(data);
    let dCriterion = GetSum(fosterStewartMethodData[2], 1);
    let deltaD = GetFosterStewartDeltaD(data.length);
    let tObserved = (dCriterion / deltaD).toFixed(presicion);
    let tCritical = AStudentT(data.length - 1, 0.05);

    let resultMessage = '';
    if (Math.abs(tObserved) > tCritical) {
        resultMessage = 'Гипотеза об отсутствии тренда отвергается  с вероятностью ошибки 5%';
    } else {
        resultMessage = 'Гипотеза об отсутствии тренда принимается с вероятностью ошибки 5%';
    }

    $('#fosterStewartDCriterian').html(dCriterion);
    $('#fosterStewartDeltaD').html(deltaD);
    $('#fosterStewartTObserved').html(tObserved);
    $('#fosterStewartTCritiсal').html(tCritical);
    $('#fosterStewartTResult').html(resultMessage);

    PrintTableBody('#fosterStewartTable',
        [
            GenerateLabels(data),
            data,
            fosterStewartMethodData[0],
            fosterStewartMethodData[1],
            fosterStewartMethodData[2]
        ],
        data.length);
}

function CalcDataForFosterStewartMethod(data) {
    let m = [];
    let l = [];
    let d = [];
    m[0] = '-';
    l[0] = '-';
    d[0] = '-';

    for (i = 1; i < data.length; ++i) {
        let more = true;
        for (let k = 0; k < i; ++k) {
            if (data[i] <= data[k]) {
                more = false;
                break;
            }
        }
        m[i] = more ? 1 : 0;

        let less = true;

        for (let k = 0; k < i; ++k) {
            if (data[i] >= data[k]) {
                less = false;
                break;
            }
        }
        l[i] = less ? 1 : 0;
        d[i] = m[i] - l[i];
    }

    return [m, l, d];
}

function DoSmoothingByMovingAverage(data, selector) {
    $('#smoothing').show();

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
}

function ShowModels(data, selector) {
    $(selector).show();
    
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

    PrintTableBody('#linearNonCenteredModelTableBody', [
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
    $('#linearNonCenteredModelEquation').html(`y = ${a1.toFixed(presicion)} * x + ${a0.toFixed(presicion)}`);

    DrawChart([data, tArray.map(item => a1 * item + a0)], '#linearNonCenteredModelChart');
}

function ShowLinearCenteredModel(data) {
    let seriesStart;
    if (isEven(data.length)) {
        seriesStart = data.length / 2;
    } else {
        seriesStart = (data.length - 1) / 2;
    }

    const tArray = GenerateNumberArray(-seriesStart, data.length - seriesStart - 1);

    const tSum = tArray.reduce((a, b) => a + b);
    const yOfTSum = data.reduce((a, b) => a + b);
    const yOfTonTSum = MultiplyArrays(tArray, data).reduce((a, b) => a + b);
    const tOnTSum = MultiplyArrays(tArray, GenerateLabels(data)).reduce((a, b) => a + b);

    const a1 = (data.length * yOfTonTSum - yOfTSum * tSum) / (data.length * tOnTSum - Math.pow(tSum, 2));
    const a0 = yOfTSum / data.length - a1 * tSum / data.length;

    PrintTableBody('#linearCenteredModelTableBody', [
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
    $('#linearCenteredModelEquation').html(`y = ${a1.toFixed(presicion)} * x + ${a0.toFixed(presicion)}`);

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

    PrintTableBody('#parabolicModelTableBody', [
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
