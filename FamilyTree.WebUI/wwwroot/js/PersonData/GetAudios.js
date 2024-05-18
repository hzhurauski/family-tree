export async function GetAudios(dataBlockId) {
  const result = await $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/Media/Audio/GetAll?dataBlockId=' + dataBlockId,
  })

  return result
}
