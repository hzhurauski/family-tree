
function DrawBlood(idWife) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {
            id: _currentFamilyTree.Id,
            bloodMainId: $("#BloodTree")[0].getAttribute("data-value"),
            currentMainId: $("#mainPerson")[0].getAttribute("data-value"),
            wifeId: idWife
        },
        url: '/FamilyTree/GetBloodTree',
        success: function (result) {
            bloodTree = result;
            DrawConnections(mainTree);
            DrawConntecionsLittleTree(mainTree);
        }
    });
}