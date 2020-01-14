function PrintTableBody(bodySelector, columns, rowsCount) {
    let html = '';
    for (let i = 0; i < rowsCount; ++i)
    {
        html += '<tr>';
        for (const item of columns)
        {
            html += `<td>${item[i]}</td>`;
        }
        html += '</tr>';
    }
    $(bodySelector).html(html);
}