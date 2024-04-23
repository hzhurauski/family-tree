import { DrawConnections } from "./Draw.js";
import { DrawConntecionsLittleTree } from "./DrawConntecionsLittleTree.js";
import { FillTree } from "./FillTree.js";
import { ImageAlign } from "./ImageAlign.js";
import { GetFamilyTree, GetFamilyTrees, ShowHasNoTreesBlock, ShowMainTree, ShowStarButtons, ShowStartTree } from "../LoadTree/LoadTree.js";


export function LoadFamilyTree() {
    window._familyTrees = GetFamilyTrees();

    if (window._familyTrees.length == 0) {
        ShowHasNoTreesBlock();
        return;
    }
    else {
        let startTree = window._familyTrees[0];

        if (sessionStorage.getItem("StartFamilyTree") === null) {
            sessionStorage.setItem("StartFamilyTree", JSON.stringify(startTree));
            window._currentFamilyTree = startTree;
        }
        else {
            window._currentFamilyTree = JSON.parse(sessionStorage.StartFamilyTree);

            let tree = window._familyTrees.find((item) => item.Id == window._currentFamilyTree.Id);

            if (tree == null)
            window._currentFamilyTree = startTree;

            if (window._currentFamilyTree.MainPersonId == null && tree.MainPersonId != null) {
                window._currentFamilyTree.MainPersonId = tree.MainPersonId;
            }
        }

        $("#headerText")[0].innerText = window._currentFamilyTree.Name; // устанавливаем имя

        if (window._currentFamilyTree.MainPersonId == null) {
            ShowHasNoTreesBlock(false);
            ShowMainTree(false);
            ShowStartTree();
        }
        else {
            GetFamilyTree(window._currentFamilyTree.Id, window._currentFamilyTree.MainPersonId).then((result) => {
                window.mainTree = result;
                $("#mainPerson")[0].setAttribute("data-value", window._currentFamilyTree.MainPersonId);
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