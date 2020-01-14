
function GetArrayFromText(text) {
    text = text.trim();
    return text.match(/[^\r\n]+/g);
}

function ConvertToNumericArray(array)
{
    array = array.map(item => parseFloat(item));
    return array;
}

