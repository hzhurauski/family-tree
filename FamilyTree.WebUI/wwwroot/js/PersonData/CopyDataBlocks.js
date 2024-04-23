export async function CopyDataBlocks(ids, dataCategoryId) {
    return $.ajax({
        async: false,
        type: "POST",
        data: {
            DataBlocksIds: ids,
            DataCategoryId: dataCategoryId
        },
        url: "/PersonContent/DataBlock/Copy",
        success: function (response) {
            window.result = true;
        }
    });
}