export function CopyDataHolders(ids, dataBlockId) {
  let result = false

  $.ajax({
    async: false,
    type: 'POST',
    data: {
      DataHoldersIds: ids,
      DataBlockId: dataBlockId,
    },
    url: '/PersonContent/DataHolder/Copy',
    success: function (response) {
      result = true
    },
  })

  return result
}
