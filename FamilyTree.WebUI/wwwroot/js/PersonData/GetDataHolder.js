export async function GetDataHolder(dataHolderId) {
  const result = await $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/PersonContent/DataHolder/Get?id=' + dataHolderId,
  })

  return result
}
