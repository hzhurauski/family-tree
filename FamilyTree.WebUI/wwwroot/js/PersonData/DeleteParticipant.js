export async function DeleteParticipant(participantId, dataBlockId) {
  let result = await $.ajax({
    type: 'POST',
    data: {
      participantId: participantId,
      dataBlockId: dataBlockId,
    },
    url: '/PersonContent/DataBlock/DeleteParticipant',
  })

  return result
}
