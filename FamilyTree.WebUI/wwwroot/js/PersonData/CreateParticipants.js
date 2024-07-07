export async function CreateParticipants() {
  const result = await $.ajax({
    type: 'POST',
    data: {
      blockId: window.g_currentDataBlock.Id,
      participantIds: window.g_currentDataBlockParticipants.map((x) => x.Id),
    },
    url: '/PersonContent/DataBlock/UpdateParticipants',
  })

  return result
}
