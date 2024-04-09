import { DrawConnections } from "./Draw.js";
import { DrawConntecionsLittleTree } from "./DrawConntecionsLittleTree.js";

export function DrawBlood(idWife) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {
            id: window._currentFamilyTree.Id,
            bloodMainId: $("#BloodTree")[0].getAttribute("data-value"),
            currentMainId: $("#mainPerson")[0].getAttribute("data-value"),
            wifeId: idWife
        },
        url: '/FamilyTree/GetBloodTree',
        success: function (result) {
            window.bloodTree = result;
            DrawConnections(window.mainTree);
            DrawConntecionsLittleTree(window.mainTree);
        }
    });
}