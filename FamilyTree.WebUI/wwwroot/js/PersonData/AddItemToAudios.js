export function AddItemToAudios(audio) {
  let audioElement = document.createElement('div')
  audioElement.classList.add('audio')
  audioElement.classList.add('audios__item')
  audioElement.setAttribute('data-id', audio.Id)

  let selectorElement = document.createElement('div')
  selectorElement.classList.add('audio__selector')

  let checkboxElement = document.createElement('div')
  checkboxElement.classList.add('checkbox')

  let inputElement = document.createElement('input')
  inputElement.type = 'checkbox'

  checkboxElement.appendChild(inputElement)
  selectorElement.appendChild(checkboxElement)

  let playButtonElement = document.createElement('div')
  playButtonElement.classList.add('audio__play')
  playButtonElement.classList.add('btn')
  playButtonElement.classList.add('btn-default')

  let playButtonImgElement = document.createElement('img')
  playButtonImgElement.src = '/images/play.svg'

  playButtonElement.appendChild(playButtonImgElement)

  let titleElement = document.createElement('div')
  titleElement.classList.add('audio__title')
  titleElement.innerHTML = audio.Title

  audioElement.appendChild(selectorElement)
  audioElement.appendChild(playButtonElement)
  audioElement.appendChild(titleElement)

  $('#person-data-block').find('.audios')[0].appendChild(audioElement)
}
