import { ShowCreatePersonForm, ShowMainTree } from '../LoadTree/LoadTree.js'

export function AddOneMorePerson(event) {
  var id = event.currentTarget.id
  var idSend = ''
  var idWifeForChild = 0

  if (id == 'blood-newBrother' || id == 'addBrother-LittleTree') {
    window._createPersonData.PersonRelationType =
      window.PersonRelationTypes.Sibling
  } else {
    if (id == 'blood-newWife' || id == 'addWife-LittleTree') {
      window._createPersonData.PersonRelationType =
        window.PersonRelationTypes.Lover
    }
    if (id == 'blood-newSon' || id == 'AddSon-LittleTree') {
      window._createPersonData.PersonRelationType =
        window.PersonRelationTypes.Child
      if (!$('#wifeOne')[0].classList.contains('newPerson')) {
        idWifeForChild = $(
          '#wifes .itemCurrent'
        )[0].firstElementChild.getAttribute('data-value')
      }
    }
  }

  idSend = $('#mainPerson')[0].getAttribute('data-value')

  window._createPersonData.WifeId = idWifeForChild
  window._createPersonData.MainPersonId = idSend
  window._createPersonData.TreeId = window._currentFamilyTree.Id

  ShowCreatePersonForm()
  ShowMainTree(false)
}
