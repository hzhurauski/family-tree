export function GetDataCategory(dataCategoryId) {
    let result = {};
    $.ajax({
        async: false,
        type: "GET",
        dataType: "json",
        url: "/PersonContent/DataCategory/Get?id=" + dataCategoryId,
        success: function (data) {
            result = data;
        }
    });
    return result;
}