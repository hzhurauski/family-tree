export async function GetVideos(dataBlockId) {
  const result = await $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/Media/Video/GetAll?dataBlockId=' + dataBlockId,
  })

  return result
}
