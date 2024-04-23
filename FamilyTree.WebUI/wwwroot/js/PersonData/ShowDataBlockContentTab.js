export function ShowDataBlockContentTab(dataBlockContentTab) {
    let dataBlockContentTabsContainersElement = $("#person-data-block")
        .find(".data-block-content")
        .find(".tabs-containers");

    dataBlockContentTabsContainersElement
        .children()
        .css("display", "none");

    switch (dataBlockContentTab) {
        case DataBlockContentTabs.Data: {
            dataBlockContentTabsContainersElement
                .find(".data-holders")
                .css("display", "block");
            break;
        }
        case DataBlockContentTabs.Images: {
            dataBlockContentTabsContainersElement
                .find(".images")
                .css("display", "grid");
            break;
        }
        case DataBlockContentTabs.Videos: {
            dataBlockContentTabsContainersElement
                .find(".videos")
                .css("display", "block");
            break;
        }
        case DataBlockContentTabs.Audios: {
            dataBlockContentTabsContainersElement
                .find(".audios")
                .css("display", "block");
            break;
        }
        case DataBlockContentTabs.Participants: {
            dataBlockContentTabsContainersElement
                .find(".participants")
                .css("display", "block");
            break;
        }

        default:
            break;
    }
}