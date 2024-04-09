export async function SelectParticipant() {
    if (!g_currentDataBlockIdsToAssignParticipant || !g_currentDataBlockIdsToAssignParticipant.length)
        return;

    const result = await $.ajax({
        type: "POST",
        data: {
            participantId: g_currentPerson.Id,
            dataBlockIds: g_currentDataBlockIdsToAssignParticipant,
        },
        url: "/PersonContent/DataBlock/InsertParticipants",
    });

    return result;
}