function ShowLinearNonCenteredModel(data) {
    const tArray = GenerateLabels(data);
    const containerSelector = '#linearNonCenteredModel';

    const tSum = tArray.reduce((a, b) => a + b);
    const yOfTSum = data.reduce((a, b) => a + b);
    const yOfTonTSum = MultiplyArrays(tArray, data).reduce((a, b) => a + b);
    const tOnTSum = MultiplyArrays(tArray, GenerateLabels(data)).reduce((a, b) => a + b);

    const a1 = (data.length * yOfTonTSum - yOfTSum * tSum) / (data.length * tOnTSum - Math.pow(tSum, 2));
    const a0 = yOfTSum / data.length - a1 * tSum / data.length;
    const modelY = tArray.map(item => a1 * item + a0);

    const forecastT = GenereateForecastTimeSeries(tArray, forecastCount);
    const forecastY = forecastT.map(item => (a1 * item + a0).toFixed(presicion));
    PrintTableBody(containerSelector + ' .forecast', [
        forecastT,
        forecastY,
    ], forecastCount);

    PrintTableBody(containerSelector + ' .model-table-body', [
        GenerateLabels(data),
        data,
        MultiplyArrays(tArray, data),
        MultiplyArrays(tArray, tArray)
    ], data.length);
    const model = `y = ${a1.toFixed(presicion)} * x + ${a0.toFixed(presicion)}`;

    $('#linearNonCenteredModelTSum').html(tSum);
    $('#linearNonCenteredModelYOfTSum').html(yOfTSum);
    $('#linearNonCenteredModelYOfTonTSum').html(yOfTonTSum.toFixed(presicion));
    $('#linearNonCenteredModelTOnTSum').html(tOnTSum.toFixed(presicion));
    $('#linearNonCenteredModelA1').html(a1.toFixed(presicion));
    $('#linearNonCenteredModelA0').html(a0.toFixed(presicion));
    $('#linearNonCenteredModelEquation').html(model);

    ShowCommonStat(data, modelY, containerSelector,  tArray, forecastT, forecastY);
    AppendModelCommonInformationToTable({
        type: 'Линейная нецентр.',
        model: model,
        absoluteError: getAbsoluteError(data, modelY),
        approximationError: getApproximationError(data, modelY),
        rmsError: getRmsError(data, modelY)
    }, commonModelInformationContainerSelector);
}

function ShowLinearCenteredModel(data) {
    const tArray = GetCenteredTimeSeries(data);
    const containerSelector = '#linearCenteredModel';

    const tSum = tArray.reduce((a, b) => a + b);
    const yOfTSum = data.reduce((a, b) => a + b);
    const yOfTonTSum = MultiplyArrays(tArray, data).reduce((a, b) => a + b);
    const tOnTSum = MultiplyArrays(tArray, GenerateLabels(data)).reduce((a, b) => a + b);

    const a1 = (data.length * yOfTonTSum - yOfTSum * tSum) / (data.length * tOnTSum - Math.pow(tSum, 2));
    const a0 = yOfTSum / data.length - a1 * tSum / data.length;

    const modelY = tArray.map(item => a1 * item + a0);
    const forecastT = GenereateForecastTimeSeries(tArray, forecastCount);
    const forecastY = forecastT.map(item => (a1 * item + a0).toFixed(presicion));
    PrintTableBody(containerSelector + ' .forecast', [
        forecastT,
        forecastY,
    ], forecastCount);

    PrintTableBody(containerSelector + ' .model-table-body', [
        tArray,
        data,
        MultiplyArrays(tArray, data),
        MultiplyArrays(tArray, tArray)
    ], data.length);
    const model = `y = ${a1.toFixed(presicion)} * x + ${a0.toFixed(presicion)}`;

    $('#linearCenteredModelTSum').html(tSum);
    $('#linearCenteredModelYOfTSum').html(yOfTSum);
    $('#linearCenteredModelYOfTonTSum').html(yOfTonTSum.toFixed(presicion));
    $('#linearCenteredModelTOnTSum').html(tOnTSum.toFixed(presicion));
    $('#linearCenteredModelA1').html(a1.toFixed(presicion));
    $('#linearCenteredModelA0').html(a0.toFixed(presicion));
    $('#linearCenteredModelEquation').html(model);

    ShowCommonStat(data, modelY, containerSelector,  tArray, forecastT, forecastY);

    AppendModelCommonInformationToTable({
        type: 'Линейная центр.',
        model: model,
        absoluteError: getAbsoluteError(data, modelY),
        approximationError: getApproximationError(data, modelY),
        rmsError: getRmsError(data, modelY)
    }, commonModelInformationContainerSelector);
}

function ShowParabolicModel(data) {
    const tArray = GetCenteredTimeSeries(data);
    const containerSelector = '#parabolicModel';

    const tSum = tArray.reduce((a, b) => a + b);
    const yOfTSum = data.reduce((a, b) => a + b);
    const yOfTonTSum = MultiplyArrays(tArray, data).reduce((a, b) => a + b);
    const tOnTSum = MultiplyArrays(tArray, GenerateLabels(data)).reduce((a, b) => a + b);
    const yOfTOnTonTSum = MultiplyArrays(data, MultiplyArrays(tArray, tArray)).reduce((a, b) => a + b);
    const tIn4Sum = tArray.map(item => Math.pow(item, 4)).reduce((a, b) => a + b);

    const a2 = (data.length * yOfTOnTonTSum - yOfTSum * tOnTSum) / (data.length * tIn4Sum - Math.pow(tOnTSum, 2));
    const a1 = yOfTonTSum / tOnTSum;
    const a0 = yOfTSum / data.length - a2 * tOnTSum / data.length;
    const modelY = tArray.map(item => a0 + a1 * item + a2 * Math.pow(item, 2));

    const forecastT = GenereateForecastTimeSeries(tArray, forecastCount);
    const forecastY = forecastT.map(item => (a0 + a1 * item + a2 * Math.pow(item, 2)).toFixed(presicion));
    PrintTableBody(containerSelector + ' .forecast', [
        forecastT,
        forecastY,
    ], forecastCount);


    PrintTableBody(containerSelector + ' .model-table-body', [
        GenerateLabels(data),
        data,
        MultiplyArrays(tArray, data),
        MultiplyArrays(tArray, tArray),
        MultiplyArrays(data, MultiplyArrays(tArray, tArray)),
        tArray.map(item => Math.pow(item, 4))
    ], data.length);

    const model = `y = ${a2.toFixed(presicion)} * x ^ 2 + ${a1.toFixed(presicion)} * x + ${a0.toFixed(presicion)}`;

    $('#parabolicModelTSum').html(tSum);
    $('#parabolicModelYOfTSum').html(yOfTSum);
    $('#parabolicModelYOfTonTSum').html(yOfTonTSum.toFixed(presicion));
    $('#parabolicModelTOnTSum').html(tOnTSum.toFixed(presicion));
    $('#parabolicModelTIn4Sum').html(tIn4Sum.toFixed(presicion));
    $('#parabolicModelA2').html(a2.toFixed(presicion));
    $('#parabolicModelA1').html(a1.toFixed(presicion));
    $('#parabolicModelA0').html(a0.toFixed(presicion));
    $('#parabolicModel2').html(model);

    ShowCommonStat(data, modelY, containerSelector,  tArray, forecastT, forecastY);

    AppendModelCommonInformationToTable({
        type: 'Параболическая центр.',
        model: model,
        absoluteError: getAbsoluteError(data, modelY),
        approximationError: getApproximationError(data, modelY),
        rmsError: getRmsError(data, modelY)
    }, commonModelInformationContainerSelector);

}

function ShowExponentialModel(data) {
    const containerSelector = '#exponentialModel';

    const tArray = GetCenteredTimeSeries(data);
    const lnYtSum = data.reduce((a, b) => a + Math.log(b));
    const t2Sum = tArray.reduce((a, b) => a + Math.pow(b, 2));
    const lnYtTSum = MultiplyArrays(data.map(item => Math.log(item)), tArray).reduce((a, b) => a + b);
    const parameterA = Math.exp(lnYtSum / data.length);
    const parameterB = Math.exp(lnYtTSum / t2Sum);
    const modelY = tArray.map(item => parameterA * Math.pow(parameterB, item));
    const forecastT = GenereateForecastTimeSeries(tArray, forecastCount);
    const forecastY = forecastT.map(item => (parameterA * Math.pow(parameterB, item)).toFixed(presicion));
    PrintTableBody(containerSelector + ' .forecast', [
        forecastT,
        forecastY,
    ], forecastCount);

    const model = `y = ${parameterA.toFixed(presicion)} * ${parameterB.toFixed(presicion)}^t`;

    $('#exponentialModelA').html(parameterA.toFixed(presicion));
    $('#exponentialModelB').html(parameterB.toFixed(presicion));
    $('#exponentialModel2').html(model);

    ShowCommonStat(data, modelY, containerSelector,  tArray, forecastT, forecastY);

    AppendModelCommonInformationToTable({
        type: 'Экспоненц. центр.',
        model: model,
        absoluteError: getAbsoluteError(data, modelY),
        approximationError: getApproximationError(data, modelY),
        rmsError: getRmsError(data, modelY)
    }, commonModelInformationContainerSelector);
}

function ShowCommonStat(data, modelY, containerSelector, tArray, forecastT = [], forecastY = []) {
    const approximationError = getApproximationError(data, modelY);
    let $container = $(containerSelector);

    $container.find('.absolute-error').html(getAbsoluteError(data, modelY));
    $container.find('.approximation-error').html(`${approximationError}%` + getConclusionByApproximationError(approximationError));
    $container.find('.rms-error').html(getRmsError(data, modelY, 1));

    DrawChart([data, modelY.concat(forecastY)], containerSelector + ' .model-chart', tArray.concat(forecastT));
}

function GetCenteredTimeSeries(data) {
    let seriesStart;
    if (isEven(data.length)) {
        seriesStart = data.length / 2;
    } else {
        seriesStart = (data.length - 1) / 2;
    }

    return GenerateNumberArray(-seriesStart, data.length - seriesStart - 1);
}

function GenereateForecastTimeSeries(tArray, forecastCount) {
    return  GenerateNumberArray(tArray[tArray.length - 1] + 1, tArray[tArray.length - 1] + forecastCount);
}