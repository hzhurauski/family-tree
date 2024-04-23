export function OpenDefaultDataBlockTab() {
    $("#person-data-block")
        .find(".data-block-content")
        .find(".tabs-buttons")
        .find(".tab-button-data")
        .click();
}