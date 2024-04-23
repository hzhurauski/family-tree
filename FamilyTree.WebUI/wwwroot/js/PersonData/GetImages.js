export async function GetImages(dataBlockId) {
    const result = await $.ajax({
        type: "GET",
        dataType: "json",
        url: "/Media/Image/GetAll?dataBlockId=" + dataBlockId
    });

    return result;
}