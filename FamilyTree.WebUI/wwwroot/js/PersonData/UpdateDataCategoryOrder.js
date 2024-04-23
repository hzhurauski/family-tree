export function UpdateDataCategoryOrder(dataCategory) {
    let result = false;

    $.ajax({
        async: false,
        type: "PUT",
        data: dataCategory,
        url: "/PersonContent/DataCategory/UpdateOrder/" + dataCategory.Id,
        success: function (response) {
            result = true;
        }
    });

    return result;
}