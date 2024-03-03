window.onload = function () {
    $("#StructInf")[0].style.display = "block";

    $(".list-item").click(function (event) {
        HideAllBlocks();
        RemoveActive();
        event.currentTarget.classList.add("active");
        switch (event.currentTarget.id)
        {
            case "OneItem": {
                $("#StructInf")[0].style.display = "block";
                break;
            }
            case "TwoItem": {
                $("#StructElemInf")[0].style.display = "block";
                break;
            }
            case "ThreeItem": {
                $("#TypeConInf")[0].style.display = "block";
                break;
            }
            case "FourItem": {
                $("#RelationInf")[0].style.display = "block";
                break;
            }
            case "lastItem": {
                $("#DeleteElemInf")[0].style.display = "block";
                break;
            }
        }
    });

    function HideAllBlocks() {
        $("#StructInf")[0].style.display = "none";
        $("#StructElemInf")[0].style.display = "none";
        $("#TypeConInf")[0].style.display = "none";
        $("#RelationInf")[0].style.display = "none";
        $("#DeleteElemInf")[0].style.display = "none";
    }
    function RemoveActive()
    {
        var list = $("#listInf .list-item");
        for (var i = 0; i < list.length; i++) {
            list[i].classList.remove("active");
        }
    }
};