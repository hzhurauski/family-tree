export async function CreatePart() {
  let result = -1

  await $.ajax({
    type: 'POST',
    data: window.dataHolder,
    url: '/PersonContent/DataBlock/UpdateParticipants',
    success: function (response) {
      result = response
    },
  })

  return result
}
