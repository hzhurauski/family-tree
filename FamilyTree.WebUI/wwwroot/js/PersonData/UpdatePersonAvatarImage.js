export async function UpdatePersonAvatarImage(personId, imageId) {
  return await $.ajax({
    type: 'PUT',
    data: {
      Id: personId,
      ImageId: imageId,
    },
    url: '/People/UpdateAvatarImage/' + personId,
  })
}
