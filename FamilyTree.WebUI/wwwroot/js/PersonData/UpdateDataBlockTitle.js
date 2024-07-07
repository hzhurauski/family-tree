export function UpdateDataBlockTitle(dataBlock) {
  let result = false

  $.ajax({
    async: false,
    type: 'PUT',
    data: dataBlock,
    url: '/PersonContent/DataBlock/UpdateTitle/' + dataBlock.Id,
    success: function (response) {
      result = true
    },
  })

  return result
}
