export async function DeleteDataBlock(dataBlockId) {
  const result = await $.ajax({
    type: 'DELETE',
    url: '/PersonContent/DataBlock/Delete/' + dataBlockId,
  })

  return result
}
