$(function () {

    $('#launchAppButton').on('click', function () {
        launchApp();
    });

});

function launchApp()
{
    const input = $('#inputData').val();
    const data = ConvertToNumericArray(GetArrayFromText(input));

    window.presicion = $('#precision').val();
    window.forecastCount = $('#forecastCount').val();

    DoSesearchOfTimeSeries(data);

}

function DoSesearchOfTimeSeries (data) {
    DrawChart(data, '#inputDataChart');
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