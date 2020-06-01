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
