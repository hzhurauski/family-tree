export function CreateDataBlock(dataBlock) {
    let result = -1;

    $.ajax({
        async: false,
        type: "POST",
        data: dataBlock,
        url: "/PersonContent/DataBlock/Create",
        success: function (response) {
            result = response;
        }
    });

    return result;
}