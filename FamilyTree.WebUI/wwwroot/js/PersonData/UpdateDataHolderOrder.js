export function UpdateDataHolderOrder(dataHolder) {
  let result = false

  $.ajax({
    async: false,
    type: 'PUT',
    data: dataHolder,
    url: '/PersonContent/DataHolder/UpdateOrder/' + dataHolder.Id,
    success: function (response) {
      result = true
    },
  })

  return result
}
