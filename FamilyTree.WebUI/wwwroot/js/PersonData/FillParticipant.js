export function FillParticipant(person, data) {
  $(person).find('.surname')[0].innerText = data.Surname

  $(person).find('.name')[0].innerText = data.Name

  $(person).find('.middlename')[0].innerText = data.Middlename

  $(person).find('.birthday')[0].innerText = data.Birthday

  if (data.AvatarImageId != null) {
    person.children[1].src = '/Media/Image/GetFile/' + data.AvatarImageId
    person.children[1].decoding = 'async'
  } else {
    person.children[1].src = '/images/person.png'
    person.children[1].decoding = 'async'
  }
}
