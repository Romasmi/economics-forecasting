
function GetArrayFromText(text) {
    text = text.trim();
    return text.match(/[^\r\n\s]+/g);
}

function ConvertToNumericArray(array)
{
    array = array.map(item => parseFloat(item.replace(',', '.')));
    return array;
}

function MultiplyArrays(array1, array2) {
    let result = [];
    for (let i = 0; i < array1.length; ++i)
    {
        result.push(parseFloat(((array1[i] * array2[i])).toFixed(presicion)));
    }
    return result;
}

function ValuesAreLessThenN(array, n) {
    let result = true;
    for (i of array)
    {
        if (!isNaN(parseInt(i)) && i > n)
        {
            result = false;
            break;
        }
    }

    return result;
}

function GetSum(arr, from = 0, to = arr.length) {
    let sum = 0;
    for (let i = from; i < to; ++i)
    {
        sum += arr[i];
    }
    return sum;
}

function GetSumByMultiplying(arr, from = 0, to = arr.length, coefficient) {
    let sum = 0;
    let j = 0;
    for (let i = from; i < to; ++i)
    {
        console.log(arr[i], coefficient[j]);
        sum += arr[i] * coefficient[j];
        ++j;
    }
    return sum;
}

function SetArrItemsPresicion(data, presicion) {
    for (let i = 0; i < data.length; ++i)
    {
        data[i] = data[i].toFixed(presicion);
    }
}

function GenerateArrayByHalf(array) {
    let generatedArray = [];
    for (let i = 0;  i < array.length; ++i)
    {
        generatedArray.push(array[i]);
    }

    for (let i = array.length - 2;  i >= 0; --i)
    {
        generatedArray.push(array[i]);
    }

    return generatedArray;
}