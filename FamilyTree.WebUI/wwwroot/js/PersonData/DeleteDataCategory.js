export async function DeleteDataCategory(dataCategoryId) {
  const result = await $.ajax({
    type: 'DELETE',
    url: '/PersonContent/DataCategory/Delete/' + dataCategoryId,
  })

  return result
}
