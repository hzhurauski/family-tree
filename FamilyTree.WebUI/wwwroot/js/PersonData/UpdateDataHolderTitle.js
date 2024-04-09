export function UpdateDataHolderTitle(dataHolder) {
    let result = false;

    $.ajax({
        async: false,
        type: "PUT",
        data: dataHolder,
        url: "/PersonContent/DataHolder/UpdateTitle/" + dataHolder.Id,
        success: function (response) {
            result = true;
        }
    });

    return result;
}