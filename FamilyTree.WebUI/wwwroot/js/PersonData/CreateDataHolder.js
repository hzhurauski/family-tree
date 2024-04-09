export function CreateDataHolder(dataHolder) {
    let result = -1;

    $.ajax({
        async: false,
        type: "POST",
        data: dataHolder,
        url: "/PersonContent/DataHolder/Create",
        success: function (response) {
            result = response;
        }
    });

    return result;
}