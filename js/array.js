
function GetArrayFromText(text) {
    text = text.trim();
    return text.match(/[^\r\n]+/g);
}

function ConvertToNumericArray(array)
{
    array = array.map(item => parseFloat(item));
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