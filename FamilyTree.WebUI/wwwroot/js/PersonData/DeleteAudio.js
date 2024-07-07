export async function DeleteAudio(audioId) {
  let result = await $.ajax({
    type: 'DELETE',
    url: '/Media/Audio/Delete/' + audioId,
  })

  return result
}
