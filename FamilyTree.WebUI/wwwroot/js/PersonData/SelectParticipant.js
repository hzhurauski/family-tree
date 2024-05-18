export async function SelectParticipant() {
    if (!window.g_currentDataBlockIdsToAssignParticipant || !window.g_currentDataBlockIdsToAssignParticipant.length)
        return;

    const result = await $.ajax({
        type: "POST",
        data: {
            participantId: window.g_currentPerson.Id,
            dataBlockIds: window.g_currentDataBlockIdsToAssignParticipant,
        },
        url: "/PersonContent/DataBlock/InsertParticipants",
    });

    return result;
}