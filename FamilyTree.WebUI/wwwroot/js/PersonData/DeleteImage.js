export async function DeleteImage(imageId) {
  const result = await $.ajax({
    type: 'DELETE',
    url: '/Media/Image/Delete/' + imageId,
  })

  return result
}
