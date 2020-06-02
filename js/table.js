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

function AppendModelCommonInformationToTable(options, selector) {
    if (!modelTableLogEnabled)
    {
        return false;
    }

    $(selector).append(`
        <tr>
          <td>${options.type}</td>
          <td>${options.model}</td>
          <td>${options.absoluteError}</td>
          <td>${options.approximationError}</td>
          <td>${options.rmsError}</td>
        </tr>
    `);
}