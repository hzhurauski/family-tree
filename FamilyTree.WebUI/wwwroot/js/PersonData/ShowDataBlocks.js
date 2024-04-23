export function ShowDataBlocks(isShow = true) {
    $("#person-data-block").find(".data-blocks")[0].style.display = isShow ? "block" : "none";
    $("#person-data-block").find("#paste-participant-button")[0].style.display = isShow ? "inline-block" : "none";
}