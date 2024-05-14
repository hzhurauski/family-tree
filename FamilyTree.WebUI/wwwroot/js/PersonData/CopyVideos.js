export async function CopyVideos(ids, dataBlockId) {
  const result = await $.ajax({
    type: 'POST',
    data: {
      VideosIds: ids,
      DataBlockId: dataBlockId,
    },
    url: '/Media/Video/Copy',
  })

  return result
}
