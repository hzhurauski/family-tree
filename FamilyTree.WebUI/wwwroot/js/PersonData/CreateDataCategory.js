/**
 * Send request to create DataCategory. Returns created DataCategory object Id or -1, if not created.
 * @param {object} dataCategory Object { CategoryType: string, Name: string, PersonId: number }
 * @returns {number}
 */
export function CreateDataCategory(dataCategory) {
  let result = -1

  $.ajax({
    async: false,
    type: 'POST',
    data: dataCategory,
    url: '/PersonContent/DataCategory/Create',
    success: function (response) {
      result = response
    },
  })

  return result
}
