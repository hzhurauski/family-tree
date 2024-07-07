export function GetDataCategories(personId) {
  let result = []
  $.ajax({
    async: false,
    type: 'GET',
    dataType: 'json',
    url: '/PersonContent/DataCategory/GetAll?personId=' + personId,
    success: function (data) {
      result = data
    },
  })
  return result
}
