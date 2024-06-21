import {
  ChangeWifeTree,
  ClearInputs,
  OnCreateFamilyTreeSubmitButtonClick,
  OnDeletePersonButtonClick,
  OnDeletePersonSubmitButtonClick,
  OnShowMainPersonButtonClick,
  OnUpdateMainPersonButtonClick,
  ShowCreatePersonForm,
  ShowMainTree,
  ShowPersonData,
  ShowStartTree,
} from '../LoadTree/LoadTree.js'
import { LoadPersonData } from '../PersonData/LoadPersonData.js'
import { NextItem, PrevItem } from '../SliderGenDrevo.js'
import { AddNewPerson } from './AddNewPerson.js'
import { AddOneMorePerson } from './AddOneMorePerson.js'
import { DrawConnections } from './Draw.js'
import { DrawBlood } from './DrawBlood.js'
import { DrawConntecionsLittleTree } from './DrawConntecionsLittleTree.js'
import { ImageAlign } from './ImageAlign.js'
import { RedrawSonsHasSonConnections } from './RedrawSonsHasSonConnections.js'
import { ShowModalPerson } from './ShowModalPerson.js'

export function InitFamilyTreeEvents() {
  // Удаляем hover-обработчики
  $('#modalBlockPerson').off('mouseenter mouseleave')

  // Добавляем click-обработчики на элементы .person и .LittleTreePerson
  $('.person').click(function (event) {
    ShowModalPerson(event)
  })

  $('.LittleTreePerson').click(function (event) {
    ShowModalPerson(event)
  })

  $('.person').dblclick(function (event) {
    if (event.target.parentElement.classList.contains('star-button')) return

    window._currentFamilyTree.MainPersonId = $(
      event.currentTarget
    )[0].getAttribute('data-value')
    sessionStorage.setItem(
      'StartFamilyTree',
      JSON.stringify(window._currentFamilyTree)
    )

    document.location.reload()
  })
  // $(".person").hover(function (event) {
  //     ShowModalPerson(event);
  // }, function () {
  //     setTimeout(function () {
  //         if (!window.visibleModal) {
  //             $("#modalBlockPerson")[0].style.visibility = "hidden";
  //         }
  //     }, 10);
  // });
  $('.LittleTreePerson').dblclick(function (event) {
    //ReloadTree($(event.currentTarget)[0].getAttribute("data-value"));

    window._currentFamilyTree.MainPersonId = $(
      event.currentTarget
    )[0].getAttribute('data-value')
    sessionStorage.setItem(
      'StartFamilyTree',
      JSON.stringify(_currentFamilyTree)
    )

    document.location.reload()
  })
  // $(".LittleTreePerson").hover(function (event) {
  //     ShowModalPerson(event);
  // }, function () {
  //     setTimeout(function () {
  //         if (!window.visibleModal) {
  //             $("#modalBlockPerson")[0].style.visibility = "hidden";
  //         }
  //     }, 10);
  // });

  $('#modalBlockPerson').hover(
    function () {
      window.visibleModal = true
    },
    function () {
      $('#modalBlockPerson')[0].style.visibility = 'hidden'
      window.visibleModal = false
    }
  )

  $('#wifes .PrevItem').click(function (event) {
    ChangeWifeTree($('#wifes .ListSlider')[0])
    PrevItem($('#prevWife')[0])
  })
  $('#wifes .NextItem').click(function (event) {
    ChangeWifeTree($('#wifes .ListSlider')[0])
    NextItem($('#nextWife')[0])
  })

  $('#wifes-LittleTree .PrevItem').click(function (event) {
    ChangeWifeTree($('#wifes-LittleTree .ListSlider')[0])
    PrevItem($('#wifes .PrevItem')[0])
  })
  $('#wifes-LittleTree .NextItem').click(function (event) {
    ChangeWifeTree($('#wifes-LittleTree .ListSlider')[0])
    NextItem($('#wifes .NextItem')[0])
  })

  // Дети
  $('#sons .PrevItem').click(function (event) {
    RedrawSonsHasSonConnections(
      $('#sons .itemCurrent')[0],
      3,
      document.getElementById('canvas4'),
      3,
      12
    )
  })
  $('#sons .NextItem').click(function (event) {
    RedrawSonsHasSonConnections(
      $('#sons .itemCurrent')[0],
      3,
      document.getElementById('canvas4'),
      3,
      12
    )
  })

  $('#sons-LittleTree .PrevItem').click(function (event) {
    RedrawSonsHasSonConnections(
      $('#sons-LittleTree .itemCurrent')[0],
      2,
      document.getElementById('canvas8'),
      5,
      18
    )
  })
  $('#sons-LittleTree .NextItem').click(function (event) {
    RedrawSonsHasSonConnections(
      $('#sons-LittleTree .itemCurrent')[0],
      2,
      document.getElementById('canvas8'),
      5,
      18
    )
  })

  // Изменеие масштаба дерева
  $('#ScaleTree').click(function () {
    if ($('#ScaleTree')[0].innerText == 'Увеличить масштаб') {
      $('#BlockFullTree')[0].style.display = 'none'
      $('#BlockPartTree')[0].style.display = 'block'
      $('#ScaleTree')[0].innerText = 'Уменьшить масштаб'
      ImageAlign()
    } else {
      $('#BlockFullTree')[0].style.display = 'block'
      $('#BlockPartTree')[0].style.display = 'none'
      $('#ScaleTree')[0].innerText = 'Увеличить масштаб'
      ImageAlign()
    }
  })
  $('#BloodTree').click(function () {
    var btnBlood = $('#BloodTree')[0]

    if (btnBlood.style.backgroundColor == '') {
      btnBlood.style.backgroundColor = '#900000'
      btnBlood.style.color = '#FFF'

      $(btnBlood).attr(
        'data-value',
        $('#mainPerson')[0].getAttribute('data-value')
      )
      window.bloodFlag = true

      DrawBlood(0)
    } else {
      btnBlood.style.backgroundColor = ''
      btnBlood.style.color = ''
      window.bloodFlag = false

      DrawConnections(window.mainTree)
      DrawConntecionsLittleTree(window.mainTree)
    }
  })

  // Добавление человека
  $('.newPerson').click(function (event) {
    if (event.currentTarget.classList.contains('newPerson')) {
      AddNewPerson(event)
    }
  }, 10)
}

$('.LittleTreePerson').dblclick(function (event) {
  //ReloadTree($(event.currentTarget)[0].getAttribute("data-value"));

  window._currentFamilyTree.MainPersonId = $(
    event.currentTarget
  )[0].getAttribute('data-value')
  sessionStorage.setItem('StartFamilyTree', JSON.stringify(_currentFamilyTree))

  document.location.reload()
})
$('.LittleTreePerson').hover(
  function (event) {
    ShowModalPerson(event)
  },
  function () {
    setTimeout(function () {
      if (!window.visibleModal) {
        $('#modalBlockPerson')[0].style.visibility = 'hidden'
      }
    }, 10)
  }
)

$('#modalBlockPerson').hover(
  function () {
    window.visibleModal = true
  },
  function () {
    $('#modalBlockPerson')[0].style.visibility = 'hidden'
    window.visibleModal = false
  }
)

$('#wifes .PrevItem').click(function (event) {
  ChangeWifeTree($('#wifes .ListSlider')[0])
  PrevItem($('#prevWife')[0])
})
$('#wifes .NextItem').click(function (event) {
  ChangeWifeTree($('#wifes .ListSlider')[0])
  NextItem($('#nextWife')[0])
})

$('#wifes-LittleTree .PrevItem').click(function (event) {
  ChangeWifeTree($('#wifes-LittleTree .ListSlider')[0])
  PrevItem($('#wifes .PrevItem')[0])
})
$('#wifes-LittleTree .NextItem').click(function (event) {
  ChangeWifeTree($('#wifes-LittleTree .ListSlider')[0])
  NextItem($('#wifes .NextItem')[0])
})

// Дети
$('#sons .PrevItem').click(function (event) {
  RedrawSonsHasSonConnections(
    $('#sons .itemCurrent')[0],
    3,
    document.getElementById('canvas4'),
    3,
    12
  )
})
$('#sons .NextItem').click(function (event) {
  RedrawSonsHasSonConnections(
    $('#sons .itemCurrent')[0],
    3,
    document.getElementById('canvas4'),
    3,
    12
  )
})

$('#sons-LittleTree .PrevItem').click(function (event) {
  RedrawSonsHasSonConnections(
    $('#sons-LittleTree .itemCurrent')[0],
    2,
    document.getElementById('canvas8'),
    5,
    18
  )
})
$('#sons-LittleTree .NextItem').click(function (event) {
  RedrawSonsHasSonConnections(
    $('#sons-LittleTree .itemCurrent')[0],
    2,
    document.getElementById('canvas8'),
    5,
    18
  )
})

// Изменеие масштаба дерева
$('#ScaleTree').click(function () {
  if ($('#ScaleTree')[0].innerText == 'Увеличить масштаб') {
    $('#BlockFullTree')[0].style.display = 'none'
    $('#BlockPartTree')[0].style.display = 'block'
    $('#ScaleTree')[0].innerText = 'Уменьшить масштаб'
    ImageAlign()
  } else {
    $('#BlockFullTree')[0].style.display = 'block'
    $('#BlockPartTree')[0].style.display = 'none'
    $('#ScaleTree')[0].innerText = 'Увеличить масштаб'
    ImageAlign()
  }
})
$('#BloodTree').click(function () {
  var btnBlood = $('#BloodTree')[0]

  if (btnBlood.style.backgroundColor == '') {
    btnBlood.style.backgroundColor = '#900000'
    btnBlood.style.color = '#FFF'

    $(btnBlood).attr(
      'data-value',
      $('#mainPerson')[0].getAttribute('data-value')
    )
    window.bloodFlag = true

    DrawBlood(0)
  } else {
    btnBlood.style.backgroundColor = ''
    btnBlood.style.color = ''
    window.bloodFlag = false

    DrawConnections(window.mainTree)
    DrawConntecionsLittleTree(window.mainTree)
  }
})

// Добавление человека
$('.newPerson').click(function (event) {
  if (event.currentTarget.classList.contains('newPerson')) {
    AddNewPerson(event)
  }
})
$('.person').click(function (event) {
  if (event.currentTarget.classList.contains('newPerson')) {
    AddNewPerson(event)
  }
})

$('.LittleTreePerson').click(function (event) {
  if (event.currentTarget.classList.contains('newPerson')) {
    AddNewPerson(event)
  }
})
$('.AddPerson-Tree').click(function (event) {
  AddOneMorePerson(event)
})
$('.AddPerson-LittleTree').click(function (event) {
  AddOneMorePerson(event)
})

$('#editPersonModal').click((e) => {
  let personId = $(e.currentTarget).attr('data-id')
  LoadPersonData(personId).then((result) => {
    if (result) {
      ShowMainTree(false)
      ShowPersonData()
    }
  })
})

$('#start-tree-block').click(() => {
  ShowStartTree(false)
  ShowCreatePersonForm()
})

$('#cancel-person-button').click(() => {
  ShowCreatePersonForm(false)
  if (window.window._familyTrees.length == 0) ShowStartTree()
  else ShowMainTree()

  ClearInputs()
})

$('#save-person-button').click(() => {
  window._createPersonData.Name = $('#create-person-name').val()
  window._createPersonData.Surname = $('#create-person-surname').val()
  window._createPersonData.Middlename = $('#create-person-middlename').val()
  window._createPersonData.Birthday = $('#create-person-birthday').val()
  window._createPersonData.Gender = $(
    'input[name="person-gender"]:checked'
  ).val()
  window._createPersonData.TreeId = window._currentFamilyTree.Id

  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/People/Create',
    data: window._createPersonData,
    success: function (data) {
      document.location.reload()

      ShowCreatePersonForm(false)
      ShowMainTree()
      ClearInputs()
    },
    error: () => {
      alert('Ошибка при создании персоны.')
    },
  })
})

$('#back-to-tree-button').click(() => {
  ShowPersonData(false)
  ShowMainTree()
})

$('#create-family-tree-button').click(() =>
  $('#create-family-tree-modal').modal('show')
)

$('#create-family-tree-submit-button').click(
  OnCreateFamilyTreeSubmitButtonClick
)

$('.star-button').click(OnUpdateMainPersonButtonClick)

$('#show-main-person-button').click(OnShowMainPersonButtonClick)

$('#delete-person-submit-button').click(OnDeletePersonSubmitButtonClick)

$('#delete-person-button').click(OnDeletePersonButtonClick)
