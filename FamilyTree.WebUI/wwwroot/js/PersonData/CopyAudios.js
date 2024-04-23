export async function CopyAudios(ids, dataBlockId) {
    const result = await $.ajax({
        type: "POST",
        data: {
            AudiosIds: ids,
            DataBlockId: dataBlockId
        },
        url: "/Media/Audio/Copy"
    });

    return result;
}