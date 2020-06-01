$(function () {
    $('#launchAppButton').on('click', function () {
        LaunchApp();
    });

    $('.showChartButton').on('click', function () {
        setTimeout(function () {
            LaunchApp();
        }, 300);
    });

    LaunchApp();

    $('.update-chartist').on('click', function () {
        let code = $(this).data('func') + "(data);";
        let f = new Function(code);
        setTimeout(function () {
            f();
        }, 300);
    });
});

function LaunchApp() {
    $inputData = $('#inputData');
    const input = $inputData.val();

    window.data = ConvertToNumericArray(GetArrayFromText(input));
    window.presicion = $('#precision').val();
    window.forecastCount = $('#forecastCount').val();

    $inputData.val(window.data.join('\r\n'));
    $('.dataCount').html(data.length);

    //DoPreliminaryAnalysis(data, '.prelitary-analysis');
    //DoResearchOfTimeSeries(data, '#researchOfTimeSeries');
    //DoResearchOfTrend(data, '#trendChecking');
    //DoSmoothing(data, '#smoothing');
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
    console.log(data);
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
        $('#correctedData').show();
    } else {
        irwinResultMessage = 'Аномальных значений не найдено. Исходный ряд остаётся без изменений.';
        $('#correctedData').hide();
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

function DoSmoothing(data, selector) {
    $(selector).show();
    DoSmoothingByMovingAverage(data);
    DoSmoothingByMovingWeightedAverage(data);
}

function ShowModels(data, selector) {
    $(selector).show();
    
    ShowLinearNonCenteredModel(data);
    ShowLinearCenteredModel(data);
    ShowParabolicModel(data);
}