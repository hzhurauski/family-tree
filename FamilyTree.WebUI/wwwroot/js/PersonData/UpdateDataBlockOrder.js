export function UpdateDataBlockOrder(dataBlock) {
  let result = false

  $.ajax({
    async: false,
    type: 'PUT',
    data: dataBlock,
    url: '/PersonContent/DataBlock/UpdateOrder/' + dataBlock.Id,
    success: function (response) {
      result = true
    },
  })

  return result
}
