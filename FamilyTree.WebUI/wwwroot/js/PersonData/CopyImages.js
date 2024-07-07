export async function CopyImages(ids, dataBlockId) {
  const result = await $.ajax({
    type: 'POST',
    data: {
      ImagesIds: ids,
      DataBlockId: dataBlockId,
    },
    url: '/Media/Image/Copy',
  })

  return result
}
