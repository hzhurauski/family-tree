export async function UpdateDataHolderData(dataHolder) {
    let result = await $.ajax({
        type: "PUT",
        data: dataHolder,
        url: "/PersonContent/DataHolder/UpdateData/" + dataHolder.Id
    });

    return result;
}