

function LoadFamilyTree() {
    _familyTrees = GetFamilyTrees();

    if (_familyTrees.length == 0) {
        ShowHasNoTreesBlock();
        return;
    }
    else {
        let startTree = _familyTrees[0];

        if (sessionStorage.getItem("StartFamilyTree") === null) {
            sessionStorage.setItem("StartFamilyTree", JSON.stringify(startTree));
            _currentFamilyTree = startTree;
        }
        else {
            _currentFamilyTree = JSON.parse(sessionStorage.StartFamilyTree);

            let tree = _familyTrees.find((item) => item.Id == _currentFamilyTree.Id);

            if (tree == null)
                _currentFamilyTree = startTree;

            if (_currentFamilyTree.MainPersonId == null && tree.MainPersonId != null) {
                _currentFamilyTree.MainPersonId = tree.MainPersonId;
            }
        }

        $("#headerText")[0].innerText = _currentFamilyTree.Name; // устанавливаем имя

        if (_currentFamilyTree.MainPersonId == null) {
            ShowHasNoTreesBlock(false);
            ShowMainTree(false);
            ShowStartTree();
        }
        else {
            GetFamilyTree(_currentFamilyTree.Id, _currentFamilyTree.MainPersonId).then((result) => {
                mainTree = result;
                $("#mainPerson")[0].setAttribute("data-value", _currentFamilyTree.MainPersonId);
                FillTree(result, false);
                DrawConnections(result);
                DrawConntecionsLittleTree(result);
                $("#BlockFullTree")[0].style.display = "block";
                setTimeout(function () { ImageAlign(); }, 200);

                ShowStartTree(false);
                ShowHasNoTreesBlock(false);
                ShowMainTree();
                ShowStarButtons();
            }, (r) => {
                alert("Ошибка при получении дерева.");
            });
        }
    }
}