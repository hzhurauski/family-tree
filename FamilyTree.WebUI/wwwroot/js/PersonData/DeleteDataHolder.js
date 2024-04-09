export async function DeleteDataHolder(dataHolderId) {
    const result = await $.ajax({
        type: "DELETE",
        url: "/PersonContent/DataHolder/Delete/" + dataHolderId
    });

    return result;
}