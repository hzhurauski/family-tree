export function CopyDataCategories(ids, personId) {
    let result = false;

    $.ajax({
        async: false,
        type: "POST",
        data: {
            DataCategoriesIds: ids,
            PersonId: personId
        },
        url: "/PersonContent/DataCategory/Copy",
        success: function (response) {
            result = true;
        }
    });

    return result;
}