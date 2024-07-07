export async function GetParticipants(dataBlockId) {
  const result = await $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/Media/Participant/GetAll?dataBlockId=' + dataBlockId,
  })

  return result
}
