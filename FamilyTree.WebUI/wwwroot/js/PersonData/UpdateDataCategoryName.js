export function UpdateDataCategoryName(dataCategory) {
  let result = false

  $.ajax({
    async: false,
    type: 'PUT',
    data: dataCategory,
    url: '/PersonContent/DataCategory/UpdateName/' + dataCategory.Id,
    success: function (response) {
      result = true
    },
  })

  return result
}
