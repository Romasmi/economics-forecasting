$(function () {
    window.commonModelInformationContainerSelector = '#modelsTableBody';

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

    let $menu = $("#menu");
    $(window).scroll(function(){
        var $sections = $('section');
        $sections.each(function(i,el){
            var top  = $(el).offset().top-100;
            var bottom = top +$(el).height();
            var scroll = $(window).scrollTop();
            var id = $(el).attr('id');
            if( scroll > top && scroll < bottom){
                $menu.find('a.active').removeClass('active');
                $('a[href="#'+id+'"]').addClass('active');
            }
        })
    });

    $menu.on("click","a", function (event) {
        event.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top - $menu.height()}, 800);
    });

    $('#modelsCommonInformationTable').tablesorter();
});

function LaunchApp() {
    window.modelTableLogEnabled = true;

    $inputData = $('#inputData');
    const input = $inputData.val();

    window.data = ConvertToNumericArray(GetArrayFromText(input));
    window.presicion = $('#precision').val();
    window.forecastCount = $('#forecastCount').val();

    $inputData.val(window.data.join('\r\n'));
    $('.dataCount').html(data.length);

    DoPreliminaryAnalysis(data, '.prelitary-analysis');
    DoResearchOfTimeSeries(data, '#researchOfTimeSeries');
    DoResearchOfTrend(data, '#trendChecking');
    DoSmoothing(data, '#smoothing');
    ShowModels(data, '#models');

    window.modelTableLogEnabled = false;
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
        irwinResultMessage = 'Исходный ряд имеет аномальные значений: ' + listOfAbnormalValuesList + '. Они замененны средними соседних уровней.';
        DrawChart([data, dataCopy], '#correctedInputDataChart');
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
    let $section = $(sectionSelector);

    PrintTableBody(sectionSelector + ' .main-indicators-table',
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

    $section.find('.data-length').html(data.length);
    $section.find('.average-increase').html(GetAverageIncrease(data));
    $section.find('.average-growth-rate').html(GetAverageGrowthRate(data));
    $section.find('.average-up-growth-rate').html(GetAverageUpGrowthRate(data));

    PrintTableBody(sectionSelector + ' .forecast-table',
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
    ShowExponentialModel(data);
}