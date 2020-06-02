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
    const tArray = GetCenteredTimeSeries(data);

    const tSum = tArray.reduce((a, b) => a + b);
    const yOfTSum = data.reduce((a, b) => a + b);
    const yOfTonTSum = MultiplyArrays(tArray, data).reduce((a, b) => a + b);
    const tOnTSum = MultiplyArrays(tArray, GenerateLabels(data)).reduce((a, b) => a + b);

    const a1 = (data.length * yOfTonTSum - yOfTSum * tSum) / (data.length * tOnTSum - Math.pow(tSum, 2));
    const a0 = yOfTSum / data.length - a1 * tSum / data.length;

    const modelY = tArray.map(item => a1 * item + a0);
    const approximationError = getApproximationError(data, modelY);

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
    $('#linearCenteredModelAbsoluteError').html(getAbsoluteError(data, modelY));
    $('#linearCenteredModelApproximationError').html(`${approximationError}%` + getConclusionByApproximationError(approximationError));
    $('#linearCenteredModelRmsError').html(getRmsError(data, modelY, 1));

    DrawChart([data, modelY], '#linearCenteredModelChart', tArray);
}

function ShowParabolicModel(data) {
    const tArray = GetCenteredTimeSeries(data);

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
    $('#parabolicModelTIn4Sum').html(tIn4Sum.toFixed(presicion));
    $('#parabolicModelA2').html(a2.toFixed(presicion));
    $('#parabolicModelA1').html(a1.toFixed(presicion));
    $('#parabolicModelA0').html(a0.toFixed(presicion));
    $('#parabolicModel2').html(`y = ${a2.toFixed(presicion)} * x ^ 2 + ${a1.toFixed(presicion)} * x + ${a0.toFixed(presicion)}`);

    DrawChart([data, tArray.map(item => a2 * Math.pow(item, 2) + a1 * item + a0)], '#parabolicModel2Chart');
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

function ShowExponentialModel(data) {
    const tArray = GetCenteredTimeSeries(data);
    const lnYtSum = data.reduce((a, b) => a + Math.log(b));
    const t2Sum = tArray.reduce((a, b) => a + Math.pow(b, 2));
    const lnYtTSum = MultiplyArrays(data.map(item => Math.log(item)), tArray).reduce((a, b) => a + b);
    const parameterA = Math.exp(lnYtSum / data.length);
    const parameterB = Math.exp(lnYtTSum / t2Sum);

    $('#exponentialModelA').html(parameterA.toFixed(presicion));
    $('#exponentialModelB').html(parameterB.toFixed(presicion));
    $('#exponentialModel2').html(`y = ${parameterA.toFixed(presicion)} * ${parameterB.toFixed(presicion)}^t`);

    DrawChart([data, tArray.map(item =>  parameterA * Math.pow(parameterB, item))], '#exponentialModelChart', tArray);
}