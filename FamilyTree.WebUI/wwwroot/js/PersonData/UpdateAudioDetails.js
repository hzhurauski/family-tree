export async function UpdateAudioDetails(audio) {
    let result = await $.ajax({
        type: "PUT",
        data: audio,
        url: "/Media/Audio/UpdateDetails/" + audio.Id
    });

    return result;
}