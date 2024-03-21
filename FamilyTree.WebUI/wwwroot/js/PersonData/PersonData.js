$(window).load(() => {
    InitPersonDataBlockButtonEvents();
});

const DataCategoryTypes = {
    InfoBlock: 0,
    ListBlock: 1,
    PersonInfo: 2,
    Education: 3,
    Residencies: 4,
    LaborActivities: 5,
    ImportantEvents: 6   
};
const DataHolderTypes = {
    Text: 0,
    TextArea: 1,
    Date: 2,
    Time: 3,
    DateTime: 4,
    Name: 5,
    Surname: 6,
    MiddleName: 7,
    Birthday: 8,
    Gender: 9
};
const DataBlockContentTabs = {
    Data: 0,
    Images: 1,
    Videos: 2,
    Audios: 3,
    Participants: 4,
};
const GenderTypes = {
    Unknown: "Unknown",
    Male: "Male",
    Female: "Female"
}
const AddButtonActionTypes = {
    AddDataBlock: 0,
    AddDataHolder: 1,
    AddImage: 2,
    AddVideo: 3,
    AddAudio: 4,
    AddParticipant: 5,
};
const PrivacyLevels = {
    TopSecret: 0,
    Confidential: 1,
    InternalUse: 2,
    PublicUse: 3
};
const CopyObjectTypes = {
    DataCategory: 0,
    DataBlock: 1,
    DataHolder: 2,
    Image: 3,
    Video: 4,
    Audio: 5,
    Participant: 6
};
const CopyObjectSessionStorageKey = "COPY_OBJECT";

const WaitForMilliseconds = (ms) => new Promise(handler => setTimeout(handler, ms));

let g_currentPerson = null;
let g_dataCategories = [];
let g_currentDataCategory = null;
let g_currentDataBlock = null;
let g_currentDataBlockImages = null;
let g_currentDataBlockVideos = null;
let g_currentDataBlockAudios = null;
let g_currentDataBlockParticipants = null;
let g_openedAudioId = null;
let g_currentAddButtonActionType = null;
let g_editElementId = null;
let g_isSaving = false;
let g_copyObject = {
    Ids: [0],
    CopyObjectType: 0
};
let g_isUploadingImage = false;
let g_isUploadingVideo = false;
let g_isUploadingAudio = false;
let g_currentDataBlockIdsToAssignParticipant = null;

async function LoadPersonData(personId) {
    g_currentPerson = await GetPersonData(personId).catch((r) => {
        g_currentPerson = null;
    });

    if (g_currentPerson == null)
        return false;

    RefreshDataCategories();

    if (g_dataCategories.length === 0)
        return false;

    UpdateDataCategories();

    $("#person-data-block")
        .find(".data-categories")
        .find(".data-categories__item")[0]
        .click();

    return true;
}

//Requests
async function GetPersonData(personId) {
    return await $.ajax({
        method: "GET",
        dataType: "json",
        url: "/People/Get/" + personId
    });
}

function GetDataCategories(personId) {
    let result = [];
    $.ajax({
        async: false,
        type: "GET",
        dataType: "json",
        url: "/PersonContent/DataCategory/GetAll?personId=" + personId,
        success: function (data) {
            result = data;
        }
    });
    return result;
}

function GetDataCategory(dataCategoryId) {
    let result = {};
    $.ajax({
        async: false,
        type: "GET",
        dataType: "json",
        url: "/PersonContent/DataCategory/Get?id=" + dataCategoryId,
        success: function (data) {
            result = data;
        }
    });
    return result;
}

async function GetDataHolder(dataHolderId) {
    const result = await $.ajax({
        type: "GET",
        dataType: "json",
        url: "/PersonContent/DataHolder/Get?id=" + dataHolderId
    });

    return result;
}

async function GetImages(dataBlockId) {
    const result = await $.ajax({
        type: "GET",
        dataType: "json",
        url: "/Media/Image/GetAll?dataBlockId=" + dataBlockId
    });

    return result;
}

async function GetVideos(dataBlockId) {
    const result = await $.ajax({
        type: "GET",
        dataType: "json",
        url: "/Media/Video/GetAll?dataBlockId=" + dataBlockId
    });

    return result;
}

async function GetAudios(dataBlockId) {
    const result = await $.ajax({
        type: "GET",
        dataType: "json",
        url: "/Media/Audio/GetAll?dataBlockId=" + dataBlockId
    });

    return result;
}

async function GetParticipants(dataBlockId) {
    const result = await $.ajax({
        type: "GET",
        dataType: "json",
        url: "/Media/Participant/GetAll?dataBlockId=" + dataBlockId
    });

    return result;
}

/**
 * Send request to create DataCategory. Returns created DataCategory object Id or -1, if not created.
 * @param {object} dataCategory Object { CategoryType: string, Name: string, PersonId: number }
 * @returns {number}
 */
function CreateDataCategory(dataCategory) {
    let result = -1;

    $.ajax({
        async: false,
        type: "POST",
        data: dataCategory,
        url: "/PersonContent/DataCategory/Create",
        success: function (response) {
            result = response;
        }
    });

    return result;
}

function CreateDataBlock(dataBlock) {
    let result = -1;

    $.ajax({
        async: false,
        type: "POST",
        data: dataBlock,
        url: "/PersonContent/DataBlock/Create",
        success: function (response) {
            result = response;
        }
    });

    return result;
}


async function CreatePart() {
    let result = -1;

    await $.ajax({
      
        type: "POST",
        data: dataHolder,
        url: "/PersonContent/DataBlock/UpdateParticipants",
        success: function (response) {
            result = response;
        }
    });

    return result;
}

function CreateDataHolder(dataHolder) {
    let result = -1;

    $.ajax({
        async: false,
        type: "POST",
        data: dataHolder,
        url: "/PersonContent/DataHolder/Create",
        success: function (response) {
            result = response;
        }
    });

    return result;
}

async function CreateImage(image) {
    let result = await $.ajax({
        type: "POST",
        data: image,
        contentType: false,
        processData: false,
        url: "/Media/Image/Create",
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener("progress", function (e) {
                    if (e.lengthComputable) {
                        $("#add-image-modal #image-upload-progress")
                            .attr({
                                value: e.loaded,
                                max: e.total
                            });
                    }
                }, false);
            }
            return myXhr;
        }
    });

    return result;
}

async function CreateVideo(video) {
    const result = await $.ajax({
        type: "POST",
        data: video,
        cache: false,
        contentType: false,
        processData: false,
        url: "/Media/Video/Create",
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener("progress", function (e) {
                    if (e.lengthComputable) {
                        $("#add-video-modal #video-upload-progress")
                            .attr({
                                value: e.loaded,
                                max: e.total
                            });
                    }
                }, false);
            }
            return myXhr;
        }
    });

    return result;
}

async function CreateAudio(audio) {
    const result = await $.ajax({
        type: "POST",
        data: audio,
        cache: false,
        contentType: false,
        processData: false,
        url: "/Media/Audio/Create",
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener("progress", function (e) {
                    if (e.lengthComputable) {
                        $("#add-audio-modal #audio-upload-progress")
                            .attr({
                                value: e.loaded,
                                max: e.total
                            });
                    }
                }, false);
            }
            return myXhr;
        }
    });

    return result;
}

async function CreateParticipants() {
    const result = await $.ajax({
        type: "POST",
        data: {
            blockId: g_currentDataBlock.Id,
            participantIds: g_currentDataBlockParticipants.map(x => x.Id),
        },
        url: "/PersonContent/DataBlock/UpdateParticipants",
    });

    return result;
}


function UpdateDataCategoryName(dataCategory) {
    let result = false;

    $.ajax({
        async: false,
        type: "PUT",
        data: dataCategory,
        url: "/PersonContent/DataCategory/UpdateName/" + dataCategory.Id,
        success: function (response) {
            result = true;
        }
    });

    return result;
}

function UpdateDataCategoryOrder(dataCategory) {
    let result = false;

    $.ajax({
        async: false,
        type: "PUT",
        data: dataCategory,
        url: "/PersonContent/DataCategory/UpdateOrder/" + dataCategory.Id,
        success: function (response) {
            result = true;
        }
    });

    return result;
}

function UpdateDataBlockTitle(dataBlock) {
    let result = false;

    $.ajax({
        async: false,
        type: "PUT",
        data: dataBlock,
        url: "/PersonContent/DataBlock/UpdateTitle/" + dataBlock.Id,
        success: function (response) {
            result = true;
        }
    });

    return result;
}

function UpdateDataBlockOrder(dataBlock) {
    let result = false;

    $.ajax({
        async: false,
        type: "PUT",
        data: dataBlock,
        url: "/PersonContent/DataBlock/UpdateOrder/" + dataBlock.Id,
        success: function (response) {
            result = true;
        }
    });

    return result;
}

function UpdateDataHolderTitle(dataHolder) {
    let result = false;

    $.ajax({
        async: false,
        type: "PUT",
        data: dataHolder,
        url: "/PersonContent/DataHolder/UpdateTitle/" + dataHolder.Id,
        success: function (response) {
            result = true;
        }
    });

    return result;
}

async function UpdateDataHolderData(dataHolder) {
    let result = await $.ajax({
        type: "PUT",
        data: dataHolder,
        url: "/PersonContent/DataHolder/UpdateData/" + dataHolder.Id
    });

    return result;
}

function UpdateDataHolderOrder(dataHolder) {
    let result = false;

    $.ajax({
        async: false,
        type: "PUT",
        data: dataHolder,
        url: "/PersonContent/DataHolder/UpdateOrder/" + dataHolder.Id,
        success: function (response) {
            result = true;
        }
    });

    return result;
}

function UpdateImageDetails(image) {
    let result = false;

    $.ajax({
        async: false,
        type: "PUT",
        data: image,
        url: "/Media/Image/UpdateDetails/" + image.Id,
        success: function (response) {
            result = true;
        }
    });

    return result;
}

function UpdateVideoDetails(video) {
    let result = false;

    $.ajax({
        async: false,
        type: "PUT",
        data: video,
        url: "/Media/Video/UpdateDetails/" + video.Id,
        success: function (response) {
            result = true;
        }
    });

    return result;
}

async function UpdateAudioDetails(audio) {
    let result = await $.ajax({
        type: "PUT",
        data: audio,
        url: "/Media/Audio/UpdateDetails/" + audio.Id
    });

    return result;
}

async function UpdatePersonAvatarImage(personId, imageId) {
    return await $.ajax({
        type: "PUT",
        data: {
            Id: personId,
            ImageId: imageId
        },
        url: "/People/UpdateAvatarImage/" + personId
    });
}

async function SaveDataHolders() {
    let dataHolders = $("#person-data-block")
        .find(".data-holders .data-holders__item");

    let updatedDataHolders = []; //Use updatedDataHolders array to avoid jQuery object each() iterating, because it cannot execute asynchronously
   // мотивация трудовой деятельности и подходы к её повышению
    dataHolders.each(async (i, el) => {
        let data = "";

        if (el.classList.contains("data-holder-gender")) {
            data = $(el).find("input[type=\"radio\"]:checked").val();
        }
        else if (el.classList.contains("data-holder-textarea")) {
            data = $(el).find("textarea").val();
        }
        else {
            data = $(el).find(".data-holder__data input").val();
        }
        let dataHolder = {
            Id: el.getAttribute("data-id"),
            Data: data
        };

        updatedDataHolders.push(dataHolder);
    });

    for (const dh of updatedDataHolders) {
        await UpdateDataHolderData(dh).catch((r) => {
            console.error(r);
        });
    }
}

async function UpdateDataHolderIds(dataHolders) {
    let currentDataHolders = $("#person-data-block")
        .find(".data-holders .data-holders__item");

    currentDataHolders.each((i, el) => {
        updatedId = dataHolders.find(x => x.Title === el.innerText).Id

        el.setAttribute("data-id", updatedId);
    });
}

function CopyDataCategories(ids, personId) {
    let result = false;

    $.ajax({
        async: false,
        type: "POST",
        data: {
            DataCategoriesIds: ids,
            PersonId: personId
        },
        url: "/PersonContent/DataCategory/Copy",
        success: function (response) {
            result = true;
        }
    });

    return result;
}

async function CopyDataBlocks(ids, dataCategoryId) {
    return $.ajax({
        async: false,
        type: "POST",
        data: {
            DataBlocksIds: ids,
            DataCategoryId: dataCategoryId
        },
        url: "/PersonContent/DataBlock/Copy",
        success: function (response) {
            result = true;
        }
    });
}

function CopyDataHolders(ids, dataBlockId) {
    let result = false;

    $.ajax({
        async: false,
        type: "POST",
        data: {
            DataHoldersIds: ids,
            DataBlockId: dataBlockId
        },
        url: "/PersonContent/DataHolder/Copy",
        success: function (response) {
            result = true;
        }
    });

    return result;
}

async function CopyImages(ids, dataBlockId) {
    const  result = await $.ajax({
        type: "POST",
        data: {
            ImagesIds: ids,
            DataBlockId: dataBlockId
        },
        url: "/Media/Image/Copy"
    });

    return result;
}

async function CopyVideos(ids, dataBlockId) {
    const result = await $.ajax({
        type: "POST",
        data: {
            VideosIds: ids,
            DataBlockId: dataBlockId
        },
        url: "/Media/Video/Copy"
    });

    return result;
}

async function CopyAudios(ids, dataBlockId) {
    const result = await $.ajax({
        type: "POST",
        data: {
            AudiosIds: ids,
            DataBlockId: dataBlockId
        },
        url: "/Media/Audio/Copy"
    });

    return result;
}

async function DeleteDataCategory(dataCategoryId) {
    const result = await $.ajax({
        type: "DELETE",
        url: "/PersonContent/DataCategory/Delete/" + dataCategoryId
    });

    return result;
}

async function DeleteDataBlock(dataBlockId) {
    const result = await $.ajax({
        type: "DELETE",
        url: "/PersonContent/DataBlock/Delete/" + dataBlockId
    });

    return result;
}

async function DeleteDataHolder(dataHolderId) {
    const result = await $.ajax({
        type: "DELETE",
        url: "/PersonContent/DataHolder/Delete/" + dataHolderId
    });

    return result;
}

async function DeleteImage(imageId) {
    const result = await $.ajax({
        type: "DELETE",
        url: "/Media/Image/Delete/" + imageId
    });

    return result;
}

async function DeleteVideo(videoId) {
    let result = await $.ajax({
        type: "DELETE",
        url: "/Media/Video/Delete/" + videoId
    });

    return result;
}

async function DeleteAudio(audioId) {
    let result = await $.ajax({
        type: "DELETE",
        url: "/Media/Audio/Delete/" + audioId
    });

    return result;
}

async function DeleteParticipant(participantId, dataBlockId) {
    let result = await $.ajax({
        type: "POST",
        data: {
            participantId: participantId,
            dataBlockId: dataBlockId,
        },
        url: "/PersonContent/DataBlock/DeleteParticipant",
    });

    return result;
}

function FillParticipant(person, data) {
    $(person).find(".surname")[0].innerText = data.Surname;

    $(person).find(".name")[0].innerText = data.Name;

    $(person).find(".middlename")[0].innerText = data.Middlename;

    $(person).find(".birthday")[0].innerText = data.Birthday;

    if (data.AvatarImageId != null) {
        person.children[1].src = "/Media/Image/GetFile/" + data.AvatarImageId;
        person.children[1].decoding = "async";
    } else {
        person.children[1].src = "/images/person.png";
        person.children[1].decoding = "async";
    }
}

//Events
function InitPersonDataBlockButtonEvents() {
    $("#person-data-block")
        .find(".data-block-content")
        .find(".tabs-buttons")
        .find(".tabs-buttons__button")
        .click(OnTabButtonClick);

    $("#add-data-category-button")
        .click(OnAddDataCategoryButtonClick);

    $("#edit-data-category-button")
        .click(OnEditDataCategoryButtonClick);

    $("#copy-data-category-button")
        .click(OnCopyDataCategoryButtonClick);

    $("#paste-data-category-button")
        .click(OnPasteDataCategoryButtonClick);

    $("#delete-data-category-button")
        .click(OnDeleteDataCategoryButtonClick);

    $("#delete-data-category-submit-button")
        .click(OnDeleteDataCategorySubmitButtonClick);

    $("#add-data-category-submit-button")
        .click(OnAddDataCategorySubmitButtonClick);

    $("#add-data-block-submit-button")
        .click(OnAddDataBlockSubmitButtonClick);

    $("#add-data-holder-submit-button")
        .click(OnAddDataHolderSubmitButtonClick);

    $("#back-to-data-blocks-button")
        .click(OnBackToDataBlocksButtonClick);

    $("#add-element-button")
        .click(OnAddElementButtonClick);

    $("#delete-button")
        .click(OnDeleteButtonClick);

    $("#edit-element-button")
        .click(OnEditElementButtonClick);

    $("#copy-button")
        .click(OnCopyButtonClick);

    $("#paste-button")
        .click(OnPasteButtonClick);

    $("#paste-participant-button")
        .click(OnPasteParticipantButton);

    $("#select-all-button")
        .click(OnSelectAllButtonClick);

    $("#deselect-all-button")
        .click(OnDeselectAllButtonClick);

    $("#invert-selection-button")
        .click(OnInvertSelectionButtonClick);

    $("#save-elements-button")
        .click(OnSaveButtonClick);

    $("#edit-privacy-button")
        .click(OnEditPrivacyButtonClick);

    $("#edit-data-category-submit-button")
        .click(OnEditDataCategorySubmitButtonClick);

    $("#edit-data-block-submit-button")
        .click(OnEditDataBlockSubmitButtonClick);

    $("#edit-data-holder-submit-button")
        .click(OnEditDataHolderSubmitButtonClick);

    $("#add-image-submit-button")
        .click(OnAddImageSubmitButtonClick);

    $("#save-image-submit-button")
        .click(OnSaveImageSubmitButtonClick);

    $("#set-image-as-avatar-button")
        .click(OnSetImageAsAvatarButtonClick);

    $("#add-video-submit-button")
        .click(OnAddVideoSubmitButtonClick);

    $("#save-video-submit-button")
        .click(OnSaveVideoSubmitButtonClick);

    $("#delete-submit-button")
        .click(OnDeleteSubmitButtonClick);

    $("#add-audio-submit-button")
        .click(OnAddAudioSubmitButtonClick);

    $("#add-participant-submit-button")
        .click(OnAddParticipantSubmitButtonClick);


    

    $("#save-audio-submit-button")
        .click(OnSaveAudioSubmitButtonClick);

    $("#video-modal").on("hidden.bs.modal", (e) => {
        $("#video-modal #current-video")[0].pause();
    });

    $("#audio-modal").on("hidden.bs.modal", (e) => {
        $("#audio-modal #current-audio")[0].pause();
    });

    $("#edit-video-privacy-button")
        .click(OnEditVideoPrivacyButtonClick);

    $("#edit-image-privacy-button")
        .click(OnEditImagePrivacyButtonClick);

    $("#edit-audio-privacy-button")
        .click(OnEditAudioPrivacyButtonClick);

    $("#select-participant-to-insert-button")
        .click(OnSelectParticipantButtonClick);
}

function OnBackToDataBlocksButtonClick() {
    ShowDataBlocks();
    ShowDataBlockContent(false);
    ShowDataBlockButtons(false);
    ShowSaveButton(false);
    g_currentAddButtonActionType = AddButtonActionTypes.AddDataBlock;
}

function OnTabButtonClick(event) {
    let targetElement = $(event.currentTarget);

    let dataBlockContentTabsButtonsElement = $("#person-data-block")
        .find(".data-block-content")
        .find(".tabs-buttons");

    if (targetElement.hasClass("tab-button-data")) {
        ShowDataBlockContentTab(DataBlockContentTabs.Data);
        g_currentAddButtonActionType = AddButtonActionTypes.AddDataHolder;
        ShowSaveButton();
        ShowEditButton();
        ShowPrivacyButton();
    }
    else if (targetElement.hasClass("tab-button-images")) {
        ShowDataBlockContentTab(DataBlockContentTabs.Images);
        g_currentAddButtonActionType = AddButtonActionTypes.AddImage;
        ShowSaveButton(false);
        ShowEditButton(false);
        ShowPrivacyButton(false);
    }
    else if (targetElement.hasClass("tab-button-videos")) {
        ShowDataBlockContentTab(DataBlockContentTabs.Videos);
        g_currentAddButtonActionType = AddButtonActionTypes.AddVideo;
        ShowSaveButton(false);
        ShowEditButton(false);
        ShowPrivacyButton(false);
    }
    else if (targetElement.hasClass("tab-button-audios")) {
        ShowDataBlockContentTab(DataBlockContentTabs.Audios);
        g_currentAddButtonActionType = AddButtonActionTypes.AddAudio;
        ShowSaveButton(false);
        ShowEditButton(false);
        ShowPrivacyButton(false);
    }
    else if (targetElement.hasClass("tab-button-participants")){
        ShowDataBlockContentTab(DataBlockContentTabs.Participants);
        g_currentAddButtonActionType = AddButtonActionTypes.AddParticipant;
        ShowSaveButton(false);
        ShowEditButton(false);
        ShowPrivacyButton(false);
    }
    else {
        return;
    }

    dataBlockContentTabsButtonsElement
        .children()
        .removeClass("tabs-buttons__button_active");

    targetElement.addClass("tabs-buttons__button_active");
}

function OnDataCategoryClick(event) {
    /*GetParticipants();*/
    if ($(event.target).is("input")) return;

    let dataCategoryId = $(event.currentTarget).attr("data-id");
    g_currentDataCategory = GetDataCategory(dataCategoryId);

    if (g_currentDataCategory == null)
        return;

    if (g_currentDataCategory.DataCategoryType == DataCategoryTypes.InfoBlock ||
        g_currentDataCategory.DataCategoryType == DataCategoryTypes.PersonInfo) {
        ShowDataBlocks(false);
        ShowDataBlockContent();

        g_currentDataBlock = g_currentDataCategory.DataBlocks[0];

        UpdateDataHolders();

        ClearImages();
        ClearVideos();
        ClearAudios();
        ClearParticipants();
        RefreshImages().then((val) => UpdateImages());
        RefreshVideos().then((val) => UpdateVideos());
        RefreshAudios().then((val) => UpdateAudios());
        RefreshParticipants().then((val) => UpdateParticipants()).then((val) => ShowSaveButton());

        OpenDefaultDataBlockTab();
    }
    else if (g_currentDataCategory.DataCategoryType == DataCategoryTypes.ListBlock ||
        g_currentDataCategory.DataCategoryType == DataCategoryTypes.Education ||
        g_currentDataCategory.DataCategoryType == DataCategoryTypes.ImportantEvents ||
        g_currentDataCategory.DataCategoryType == DataCategoryTypes.LaborActivities ||
        g_currentDataCategory.DataCategoryType == DataCategoryTypes.Residencies) {

        ShowDataBlocks();
        ShowDataBlockContent(false);
        ShowSaveButton(false);

        g_currentAddButtonActionType = AddButtonActionTypes.AddDataBlock;
                
        UpdateDataBlocks();
    }
    else {
        return;
    }

    ShowDataBlockButtons(false);

    $("#person-data-block")
        .find(".data-categories")
        .find(".data-categories__item")
        .removeClass("data-categories__item_active");

    $(event.currentTarget)
        .addClass("data-categories__item_active");
}

function OnDataBlockClick(event) {
    if ($(event.target).is("input")) return;

    let dataBlockId = $(event.currentTarget).attr("data-id");

    RefreshDataBlock(dataBlockId);

    ShowDataBlockButtons();
}

function RefreshDataBlock(dataBlockId) {
    let dataBlock = g_currentDataCategory.DataBlocks
        .find((item) => item.Id == dataBlockId);

    g_currentDataBlock = dataBlock;
    g_currentAddButtonActionType = AddButtonActionTypes.AddDataHolder;

    UpdateDataHolders();

    ClearImages();
    ClearVideos();
    ClearAudios();
    ClearParticipants();
    RefreshImages().then((val) => UpdateImages());
    RefreshVideos().then((val) => UpdateVideos());
    RefreshAudios().then((val) => UpdateAudios());
    RefreshParticipants().then((val) => UpdateParticipants()).then((val) => ShowSaveButton());

    ShowDataBlockButtons();
    ShowDataBlocks(false);
    ShowDataBlockContent();
    OpenDefaultDataBlockTab();
}

function OnImageClick(event) {
    if ($(event.target).is("input")) return;

    let imageId = $(event.currentTarget).attr("data-id");

    UpdateImageSlider(imageId);

    $("#image-carousel-modal").modal("show");
}

function OnPartClick(event) {
    if ($(event.target).is("input")) return;

    let partId = $(event.currentTarget).attr("data-id");

    UpdateParticipants();

   /* $("#image-carousel-modal").modal("show")*/;
}

function OnVideoClick(event) {
    if ($(event.target).is("input")) return;

    let videoId = $(event.currentTarget).attr("data-id");

    UpdateVideoModalVideos();

    $("#video-modal .videos-list .videos-list__item[data-id=\"" + videoId + "\"]")
        .click();

    $("#video-modal").modal("show");
}

function OnPlayAudioButtonClick(event) {
    let audioId = $(event.currentTarget).parent().attr("data-id");

    g_openedAudioId = audioId;

    UpdateAudioModal(audioId);

    $("#audio-modal").modal("show");

    $("#audio-modal #current-audio")[0].play();
}

function OnAddDataCategoryButtonClick() {
    $('#add-data-category-modal').modal("show");
}

function OnEditDataCategoryButtonClick() {
    $('#edit-data-category-modal').modal("show");
}

function OnCopyDataCategoryButtonClick() {
    CopySelectedDataCategories();
}

function OnSelectParticipantButtonClick() {
    SelectParticipant().then((value) => {
        RefreshDataBlocks();
        UpdateDataBlocks();
    });
}

function OnPasteDataCategoryButtonClick() {
    PasteDataCategories();
}

function OnDeleteDataCategoryButtonClick() {
    $('#delete-data-category-modal').modal("show");
}

function OnAddDataCategorySubmitButtonClick() {
    let dataCategory = {
        DataCategoryType: $("#add-data-category-type").val(),
        Name: $("#add-data-category-name").val(),
        PersonId: g_currentPerson.Id
    };

    if (CreateDataCategory(dataCategory) === -1) {
        alert("Ошибка при создании категории данных.");
    }
    else {
        $("#add-data-category-modal").modal("hide");
        RefreshDataCategories()
        UpdateDataCategories();
    }
}

function OnDeleteDataCategorySubmitButtonClick() {
    DeleteSelectedDataCategories().then((val) => {
        RefreshDataCategories()
        UpdateDataCategories();
        $("#delete-data-category-modal").modal("hide");
    });
}

function OnAddElementButtonClick() {
    switch (g_currentAddButtonActionType) {
        case AddButtonActionTypes.AddDataBlock: {
            $("#add-data-block-modal").modal("show");
            break;
        }
        case AddButtonActionTypes.AddDataHolder: {
            $("#add-data-holder-modal").modal("show");
            break;
        }
        case AddButtonActionTypes.AddImage: {
            $("#add-image-modal").modal("show");
            break;
        }
        case AddButtonActionTypes.AddVideo: {
            $("#add-video-modal").modal("show");
            break;
        }
        case AddButtonActionTypes.AddAudio: {
            $("#add-audio-modal").modal("show");
            break;
        }

        default:
            break;
    }
}

function OnAddDataBlockSubmitButtonClick() {
    let dataBlock = {
        Title: $("#add-data-block-title").val(),
        DataCategoryId: g_currentDataCategory.Id
    };

    if (CreateDataBlock(dataBlock) === -1) {
        alert("Ошибка при создании блока данных.");
    }
    else {
        $("#add-data-block-modal").modal("hide");
        RefreshDataBlocks();
        UpdateDataBlocks();
    }
}

function OnAddDataHolderSubmitButtonClick() {
    let dataHolder = {
        DataHolderType: $("#add-data-holder-type").val(),
        Title: $("#add-data-holder-title").val(),
        Data: "",
        DataBlockId: g_currentDataBlock.Id
    };

    if (CreateDataHolder(dataHolder) === -1) {
        alert("Ошибка при создании ячейки данных.");
    }
    else {
        $("#add-data-holder-modal").modal("hide");
        RefreshDataHolders();
        UpdateDataHolders();
    }
}

function OnAddImageSubmitButtonClick() {
    if (g_isUploadingImage) return;

    let imageModal = $("#add-image-modal");

    let files = imageModal.find("#image-file")[0].files;

    if (files.length == 0) {
        alert("Пожалуйста выберите файл.");
        return;
    }

    //File must be smaller than 2 GB
    if (files[0].size > 2147483647) {
        alert("Размер файла превышает лимит в 2 ГБ");
        return;
    }

    let formData = new FormData();
    formData.append("DataBlockId", g_currentDataBlock.Id);
    formData.append("Title", imageModal.find("#image-title").val());
    formData.append("Description", imageModal.find("#image-desc").val());
    formData.append("ImageFile", files[0]);

    g_isUploadingImage = true;
    imageModal.find("#image-file").prop("disabled", true);

    CreateImage(formData).then((result) => {
        imageModal.modal("hide");
        RefreshImages().then((val) => UpdateImages());
        g_isUploadingImage = false;
        imageModal.find("#image-file").prop("disabled", false);
    }, (r) => {
        alert("Ошибка при создании изображения.");
        g_isUploadingImage = false;
        imageModal.find("#image-file").prop("disabled", false);
    });
}

function OnAddVideoSubmitButtonClick() {
    if (g_isUploadingVideo) return;

    let videoModal = $("#add-video-modal");

    let files = videoModal.find("#video-file")[0].files;

    if (files.length == 0) {
        alert("Пожалуйста выберите файл.");
        return;
    }

    let formData = new FormData();
    formData.append("DataBlockId", g_currentDataBlock.Id);
    formData.append("Title", videoModal.find("#video-title").val());
    formData.append("Description", videoModal.find("#video-desc").val());
    formData.append("VideoFile", files[0]);

    g_isUploadingVideo = true;
    videoModal.find("#video-file").prop("disabled", true);

    CreateVideo(formData).then(
        (data) => {
            videoModal.modal("hide");
            RefreshVideos().then((val) => UpdateVideos());
            g_isUploadingVideo = false;
            videoModal.find("#video-file").prop("disabled", false);
        },
        (r) => {
            alert("Ошибка при создании видео.");
            g_isUploadingVideo = false;
            videoModal.find("#video-file").prop("disabled", false);
        });
}

function OnAddAudioSubmitButtonClick() {
    if (g_isUploadingAudio) return;

    let audioModal = $("#add-audio-modal");

    let files = audioModal.find("#audio-file")[0].files;

    if (files.length == 0) {
        alert("Пожалуйста выберите файл.");
        return;
    }

    let formData = new FormData();
    formData.append("DataBlockId", g_currentDataBlock.Id);
    formData.append("Title", audioModal.find("#audio-title").val());
    formData.append("Description", audioModal.find("#audio-desc").val());
    formData.append("AudioFile", files[0]);

    g_isUploadingAudio = true;
    audioModal.find("#audio-file").prop("disabled", true);

    CreateAudio(formData).then((result) => {
        audioModal.modal("hide");
        RefreshAudios().then((val) => UpdateAudios());
        g_isUploadingAudio = false;
        audioModal.find("#audio-file").prop("disabled", false);
    }, (r) => {
        alert("Ошибка при создании аудио.");
        g_isUploadingAudio = false;
        audioModal.find("#audio-file").prop("disabled", false);
    });
    //CreateParticipant(formData).then((result) => {
    //    audioModal.modal("hide");
    //    RefreshParticipants().then((val) => UpdateParticipants());
    //    g_isUploadingAudio = false;
    //    audioModal.find("#participant").prop("disabled", false);
    //}, (r) => {
    //    alert("Ошибка при создании аудио.");
    //    g_isUploadingAudio = false;
    //    audioModal.find("#participant").prop("disabled", false);
    //});
}



function OnAddParticipantSubmitButtonClick() {
    let partModal = $("#add-participant-modal");

    partModal.modal("hide");
    RefreshParticipants().then((val) => UpdateParticipants());

  
    CreateParticipants().then((result) => {
       RefreshParticipants().then((val) => UpdateParticipants());
       partModal.find("#participant").prop("disabled", false);
    });
}


function OnEditElementButtonClick() {
    switch (g_currentAddButtonActionType) {
        case AddButtonActionTypes.AddDataBlock: {
            let selectedDataBlocks = $("#person-data-block")
                .find(".data-blocks")
                .find(".data-blocks__item input[type=\"checkbox\"]:checked")
                .parents(".data-blocks__item");

            if (selectedDataBlocks.length == 0 ||
                selectedDataBlocks.length > 1) return;

            g_editElementId = selectedDataBlocks.attr("data-id");
            $("#edit-data-block-title")
                .val(selectedDataBlocks
                        .first()
                        .find(".data-block__value")[0]
                        .innerHTML);

            $("#edit-data-block-modal").modal("show");
            break;
        }
        case AddButtonActionTypes.AddDataHolder: {
            let selectedDataHolders = $("#person-data-block")
                .find(".data-holders")
                .find(".data-holders__item input[type=\"checkbox\"]:checked")
                .parents(".data-holders__item");

            if (selectedDataHolders.length == 0 ||
                selectedDataHolders.length > 1) return;

            g_editElementId = selectedDataHolders.attr("data-id");

            let titleEl = selectedDataHolders
                .first()
                .find(".data-holder__title div")[0];

            if (titleEl == null)
                titleEl = selectedDataHolders
                    .first()
                    .find(".data-holder-gender__title div")[0];

            if (titleEl == null)
                titleEl = selectedDataHolders
                    .first()
                    .find(".data-holder-textarea__title div")[0];

            $("#edit-data-holder-title")
                .val(titleEl.innerHTML);

            $("#edit-data-holder-modal").modal("show");
            break;
        }

        default:
            break;
    }
}

function OnCopyButtonClick() {
    switch (g_currentAddButtonActionType) {
        case AddButtonActionTypes.AddDataBlock: {
            CopySelectedDataBlocks();
            break;
        }
        case AddButtonActionTypes.AddDataHolder: {
            CopySelectedDataHolders();
            break;
        }
        case AddButtonActionTypes.AddImage: {
            CopySelectedImages();
            break;
        }
        case AddButtonActionTypes.AddVideo: {
            CopySelectedVideos();
            break;
        }
        case AddButtonActionTypes.AddAudio: {
            CopySelectedAudios();
            break;
        }

        default:
            break;
    }
}

function OnPasteButtonClick() {
    switch (g_currentAddButtonActionType) {
        case AddButtonActionTypes.AddDataBlock: {
            PasteDataBlocks();
            break;
        }
        case AddButtonActionTypes.AddDataHolder: {
            PasteDataHolders();
            break;
        }
        case AddButtonActionTypes.AddImage: {
            PasteImages();
            break;
        }
        case AddButtonActionTypes.AddVideo: {
            PasteVideos();
            break;
        }
        case AddButtonActionTypes.AddAudio: {
            PasteAudios();
            break;
        }

        default:
            break;
    }
}

function OnPasteParticipantButton() {
    g_currentDataBlockIdsToAssignParticipant = GetSelectedDataBlocksIds();
}

function OnDeleteButtonClick() {
    $("#delete-modal").modal("show");
}

function OnDeleteSubmitButtonClick() {
    switch (g_currentAddButtonActionType) {
        case AddButtonActionTypes.AddDataBlock: {
            DeleteSelectedDataBlocks().then((val) => {
                RefreshDataBlocks();
                UpdateDataBlocks();
                $("#delete-modal").modal("hide");
            });
            break;
        }
        case AddButtonActionTypes.AddDataHolder: {
            DeleteSelectedDataHolders().then((val) => {
                RefreshDataHolders();
                UpdateDataHolders();
                $("#delete-modal").modal("hide");
            });
            break;
        }
        case AddButtonActionTypes.AddImage: {
            DeleteSelectedImages().then((val) => {
                RefreshImages().then((val) => {
                    UpdateImages();
                    $("#delete-modal").modal("hide");
                });
            });            
            break;
        }
        case AddButtonActionTypes.AddVideo: {
            DeleteSelectedVideos().then((val) => {
                RefreshVideos().then((val) => {
                    UpdateVideos();
                    $("#delete-modal").modal("hide");
                });                
            });
            break;
        }
        case AddButtonActionTypes.AddAudio: {
            DeleteSelectedAudios().then((val) => {
                RefreshAudios().then((val) => {
                    UpdateAudios();
                    $("#delete-modal").modal("hide");
                });
            });
            break;
        }
        case AddButtonActionTypes.AddParticipant: {
            DeleteSelectedParticipants().then((val) => {
                RefreshParticipants().then((val) => {
                    UpdateParticipants();
                    $("#delete-modal").modal("hide");
                });
            });
            break;
        }

        default:
            break;
    }    
}

function OnSaveButtonClick() {
    if (g_isSaving) return;
    if ($("#person-data-block").find(".data-holders .data-holders__item").length === 0) return;
    g_isSaving = true;

    IsViewDataBlockAsParticipant() ? SaveCopiedDataAsParticipant() : SaveData();
}

async function SaveData() {
    let saveButton = $("#save-elements-button");
    saveButton.find(".loader").css("display", "block");
    saveButton.find(".btn__text")[0].innerHTML = "Сохранение";

    await SaveDataHolders().then(async (data) => {
        g_currentDataCategory = GetDataCategory(g_currentDataCategory.Id);

        if (g_currentDataCategory.DataCategoryType == DataCategoryTypes.PersonInfo)
            ReloadTree($("#mainPerson")[0].getAttribute("data-value"));

        saveButton.find(".loader").css("display", "none");
        saveButton.find(".btn__text")[0].innerHTML = "Сохранено";
        saveButton.removeClass("btn-default");
        saveButton.addClass("btn-success");
        await WaitForMilliseconds(1500);
    },
    (r) => {
        alert("Произошла ошибка во время сохранения.");
    });

    saveButton.find(".btn__text")[0].innerHTML = "Сохранить";
    saveButton.removeClass("btn-success");
    saveButton.addClass("btn-default");

    g_isSaving = false;
}

async function SaveCopiedDataAsParticipant() {
    let saveButton = $("#save-elements-button");
    saveButton.find(".loader").css("display", "block");
    saveButton.find(".btn__text")[0].innerHTML = "Сохранение";

    let createdDataholdersByDataBlockIds;

    await CopyDataBlocks([ g_currentDataBlock.Id ], g_currentDataCategory.Id)
    .then(async (data) => {
        createdDataholdersByDataBlockIds = data[0];
        await DeleteParticipant(g_currentPerson.Id, g_currentDataBlock.Id)
    .then(async (data) => {
        UpdateDataHolderIds(createdDataholdersByDataBlockIds.DataHolders);
        await SaveDataHolders()
    .then(async (data) => {
        g_currentDataCategory = GetDataCategory(g_currentDataCategory.Id);  
        RefreshDataBlock(createdDataholdersByDataBlockIds.Id);

        if (g_currentDataCategory.DataCategoryType == DataCategoryTypes.PersonInfo)
            ReloadTree($("#mainPerson")[0].getAttribute("data-value"));

        saveButton.find(".loader").css("display", "none");
        saveButton.find(".btn__text")[0].innerHTML = "Сохранено";
        saveButton.removeClass("btn-default");
        saveButton.addClass("btn-success");
        await WaitForMilliseconds(1500);
    },
    (r) => {
        alert("Произошла ошибка во время сохранения.");
    })})});

    saveButton.find(".btn__text")[0].innerHTML = "Сохранить";
    saveButton.removeClass("btn-success");
    saveButton.addClass("btn-default");
}

function OnEditPrivacyButtonClick() {  
    switch (g_currentAddButtonActionType) {
        case AddButtonActionTypes.AddDataHolder: {
            let selectedDataHolders = $("#person-data-block")
                .find(".data-holders")
                .find(".data-holders__item input[type=\"checkbox\"]:checked")
                .parents(".data-holders__item");
            
            if (selectedDataHolders.length == 0 ||
                selectedDataHolders.length > 1) return;

            let dataHolderId = selectedDataHolders.attr("data-id");
            let dataHolderPrivacy = g_currentDataBlock
                .DataHolders
                .find(dh => dh.Id == dataHolderId)
                .Privacy;

            g_editPrivacyId = dataHolderPrivacy.Id;

            LoadPrivacyData(dataHolderPrivacy);
            break;
        }
            
        default:
            return;
    }

    $("#privacy-level-modal").modal("show");
}

function OnEditVideoPrivacyButtonClick() {
    $("#privacy-level-modal").modal("show");
}

function OnEditImagePrivacyButtonClick() {
    $("#privacy-level-modal").modal("show");
}

function OnEditAudioPrivacyButtonClick() {
    $("#privacy-level-modal").modal("show");
}

function OnEditDataCategorySubmitButtonClick() {
    let dataCategory = {
        Id: g_editElementId,
        Name: $("#edit-data-category-name").val()
    };

    if (!UpdateDataCategoryName(dataCategory)) {
        alert("Ошибка при изменении имени категории.");
    }
    else {
        $("#edit-data-category-modal").modal("hide");
        RefreshDataCategories()
        UpdateDataCategories();
    }
}

function OnEditDataBlockSubmitButtonClick() {
    let dataBlock = {
        Id: g_editElementId,
        Title: $("#edit-data-block-title").val()
    };

    if (!UpdateDataBlockTitle(dataBlock)) {
        alert("Ошибка при изменении заголовка блока для данных.");
    }
    else {
        $("#edit-data-block-modal").modal("hide");
        RefreshDataBlocks();
        UpdateDataBlocks();
    }
}

function OnEditDataHolderSubmitButtonClick() {
    let dataHolder = {
        Id: g_editElementId,
        Title: $("#edit-data-holder-title").val()
        //,isShown: $("edit-data-holder-order").val()
    };

    if (!UpdateDataHolderTitle(dataHolder)) {
        alert("Ошибка при изменении параметров ячейки.");
    }
    else {
        $("#edit-data-holder-modal").modal("hide");
        RefreshDataHolders();
        UpdateDataHolders();
    }
}

function OnSliderArrowClick() {
    let slider = $("#image-carousel-modal")
        .find(".slider");

    let imageId = slider
        .find(".slick-active")
        .attr("data-id");

    UpdateSliderImageDetails(imageId);
}

function OnSaveImageSubmitButtonClick() {
    let currentImageId = GetImageSliderCurrentImageId();
    let sliderModal = $("#image-carousel-modal");

    let image = {
        Id: currentImageId,
        Title: sliderModal.find("#slider-image-title").val(),
        Description: sliderModal.find("#slider-image-desc").val()
    };

    if (!UpdateImageDetails(image)) {
        alert("Ошибка при сохранении данных изображения.");
    }
    else {
        RefreshImages().then(val => UpdateSliderImageDetails(currentImageId));
    }
}

function OnSetImageAsAvatarButtonClick() {
    $("#image-carousel-modal").find("#set-image-as-avatar-button")
        .prop("disabled", true);
    UpdatePersonAvatarImage(g_currentPerson.Id, GetImageSliderCurrentImageId()).then((result) => {
        ReloadTree(_currentFamilyTree.MainPersonId);
        GetPersonData(g_currentPerson.Id).then((result) => {
            g_currentPerson = result;
            UpdateSliderImageDetails(GetImageSliderCurrentImageId());
        });
    }, (r) => {
        alert("Ошибка при задании изображения аватара персоны.");
    });
}

function OnVideoModalVideoClick(event) {    
    let videosListItemElement = $(event.currentTarget);
    let videoId = videosListItemElement.attr("data-id");

    UpdateVideoModal(videoId);

    SelectVideoModalVideo(videoId);
}

function OnSaveVideoSubmitButtonClick() {
    let currentVideoId = GetVideoModalCurrentVideoId();
    let videoModal = $("#video-modal");

    let video = {
        Id: currentVideoId,
        Title: videoModal.find("#current-video-title").val(),
        Description: videoModal.find("#current-video-desc").val()
    };

    if (!UpdateVideoDetails(video)) {
        alert("Ошибка при сохранении данных видео.");
    }
    else {
        RefreshVideos().then((val) => {
            UpdateVideoModalVideos();
            SelectVideoModalVideo(currentVideoId);
        });
    }
}

function OnSaveAudioSubmitButtonClick() {
    let audioModal = $("#audio-modal");

    let audio = {
        Id: g_openedAudioId,
        Title: audioModal.find("#current-audio-title").val(),
        Description: audioModal.find("#current-audio-desc").val()
    };

    UpdateAudioDetails(audio).then((result) => {
        RefreshAudios().then((result) => {
            UpdateAudios();
        });
    }, (r) => {
        alert("Ошибка при сохранении информации аудио.");
    });
}

function OnSelectAllButtonClick() {   
    SelectAllCheckboxes(GetCurrentActionTypeElements());
}

function OnDeselectAllButtonClick() {
    DeselectAllCheckboxes(GetCurrentActionTypeElements());
}

function OnInvertSelectionButtonClick() {
    InverseSelectCheckboxes(GetCurrentActionTypeElements());
}

//UI
function UpdateDataCategories() {
    ClearDataCategories();

    g_dataCategories.forEach((item) => {
        AddItemToDataCategories(item);
    });

    new Sortable($(".person-data-block__data-categories")[0], {
        handle: ".data-categories__item",
        animation: 500,
        onEnd: (event) => {
            let dataCategory = {
                Id: $(event.item).attr("data-id"),
                Order: event.newIndex + 1
            };

            UpdateDataCategoryOrder(dataCategory);
        }
    });

    $("#person-data-block")
        .find(".data-categories")
        .find(".data-categories__item")
        .click(OnDataCategoryClick);
}

function UpdateDataBlocks() {
    ClearDataBlocks();

    g_currentDataCategory
        .DataBlocks
        .forEach((item) => {
            AddItemToDataBlocks(item);
        });

    new Sortable($(".person-data-block__data-blocks")[0], {
        handle: ".data-block__selector",
        animation: 500,
        onEnd: (event) => {
            let dataBlock = {
                Id: $(event.item).attr("data-id"),
                Order: event.newIndex + 1
            };

            UpdateDataBlockOrder(dataBlock);
        }
    });

    $("#person-data-block")
        .find(".data-blocks")
        .find(".data-blocks__item")
        .click(OnDataBlockClick);
}

function UpdateDataHolders() {
    ClearDataHolders();

    if (g_currentDataBlock == null)
        return;

    g_currentDataBlock
        .DataHolders
        .forEach((item) => {
            AddItemToDataHolders(item);
        });

    new Sortable($(".person-data-block__data-holders")[0], {
        handle: ".data-holder__selector, .data-holder-gender__selector, .data-holder-textarea__selector",
        animation: 500,
        onEnd: (event) => {
            let dataHolder = {
                Id: $(event.item).attr("data-id"),
                Order: event.newIndex + 1
            };

            UpdateDataHolderOrder(dataHolder);
        }
    });
}

function UpdateImages() {
    ClearImages();

    if (g_currentDataBlockImages == null)
        return;

    g_currentDataBlockImages
        .forEach((item) => {
            AddItemToImages(item);
        });

    $("#person-data-block")
        .find(".images .images__item")
        .click(OnImageClick);
}

function UpdateImageSlider(imageId) {
    let slider = $("#image-carousel-modal")
        .find(".slider");

    if (slider.hasClass("slick-initialized")) {
        slider.slick("unslick");
        ClearSliderImages();
    }        

    if (g_currentDataBlockImages == null)
        return;

    g_currentDataBlockImages
        .forEach((item) => {
            AddImageToSlider(item);
        });

    let initialSlide = 0;

    let selectedImage = g_currentDataBlockImages
        .find(item => item.Id == imageId);

    initialSlide = g_currentDataBlockImages.indexOf(selectedImage);

    slider.slick({
        slidesToScroll: 1,
        slidesToShow: 1,
        draggable: false,
        arrows: true,
        variableWidth: true
    });

    slider
        .find(".slick-arrow")
        .click(OnSliderArrowClick);    

    slider.slick("slickGoTo", initialSlide, false);

    UpdateSliderImageDetails(imageId);
}

function UpdateSliderImageDetails(imageId) {
    let sliderModal = $("#image-carousel-modal");

    let image = g_currentDataBlockImages
        .find(item => item.Id == imageId);

    sliderModal
        .find("#slider-image-title")
        .val(image.Title);

    sliderModal
        .find("#slider-image-desc")
        .val(image.Description);

    sliderModal
        .find(".pages__current-page")
        .text(sliderModal.find(".slider").slick("slickCurrentSlide") + 1);

    sliderModal
        .find(".pages__count")
        .text(g_currentDataBlockImages.length);

    if (g_currentPerson.AvatarImageId == imageId) {
        sliderModal.find("#set-image-as-avatar-button")
            .prop("disabled", true)[0]
            .innerHTML = "Уже является изображением персоны";
    }
    else {
        sliderModal.find("#set-image-as-avatar-button")
            .prop("disabled", false)[0]
            .innerHTML = "Сделать изображением персоны";
    }

    let privacyElement = sliderModal.find(".privacy .privacy__privacy-level")[0];
    SetPrivacyElementPrivacyLevel(privacyElement, image.Privacy.PrivacyLevel);
    g_editPrivacyId = image.Privacy.Id;
    LoadPrivacyData(image.Privacy);
}

function UpdateImageSliderImagePrivacy() {
    let sliderModal = $("#image-carousel-modal");
    let image = g_currentDataBlockImages
        .find(item => item.Id == GetImageSliderCurrentImageId());

    if (image == null)
        return;

    let privacyElement = sliderModal.find(".privacy .privacy__privacy-level")[0];
    SetPrivacyElementPrivacyLevel(privacyElement, image.Privacy.PrivacyLevel);
}

function UpdateVideos() {
    ClearVideos();

    if (g_currentDataBlockVideos == null)
        return;

    g_currentDataBlockVideos
        .forEach((item) => {
            AddItemToVideos(item);
        });

    $("#person-data-block")
        .find(".videos .videos__item")
        .click(OnVideoClick);
}

function UpdateAudios() {
    ClearAudios();

    if (g_currentDataBlockAudios == null)
        return;

    g_currentDataBlockAudios
        .forEach((item) => {
            AddItemToAudios(item);
        });

    $("#person-data-block")
        .find(".audios .audios__item .audio__play")
        .click(OnPlayAudioButtonClick);
}

function UpdateParticipants() {
    ClearParticipants();

    if (g_currentDataBlockParticipants == null)
        return;

        g_currentDataBlockParticipants
        .forEach((item) => {
            AddItemToParticipant(item);
        });

    $("#person-data-block")
        .find(".participants .participants__item")
        .click(OnPartClick);
}

function UpdateVideoModal(videoId) {
    let videoModal = $("#video-modal");
    let currentVideoElement = videoModal.find("#current-video")[0];

    let currentVideo = g_currentDataBlockVideos
        .find((item) => item.Id == videoId);

    videoModal.find("#current-video-title").val(currentVideo.Title);
    videoModal.find("#current-video-desc").val(currentVideo.Description);

    currentVideoElement.poster = "data:image/" + currentVideo.PreviewImageType + ";base64," + currentVideo.PreviewImageData;
    currentVideoElement.src = "Media/Video/GetFile/" + videoId;
    currentVideoElement.volume = 0.1;

    let privacyElement = videoModal.find(".privacy .privacy__privacy-level")[0];
    SetPrivacyElementPrivacyLevel(privacyElement, currentVideo.Privacy.PrivacyLevel);
    g_editPrivacyId = currentVideo.Privacy.Id;
    LoadPrivacyData(currentVideo.Privacy);
}

function UpdateVideoModalVideoPrivacy() {
    let videoModal = $("#video-modal");
    let currentVideo = g_currentDataBlockVideos
        .find((item) => item.Id == GetVideoModalCurrentVideoId());

    if (currentVideo == null)
        return;

    let privacyElement = videoModal.find(".privacy .privacy__privacy-level")[0];
    SetPrivacyElementPrivacyLevel(privacyElement, currentVideo.Privacy.PrivacyLevel);
}

function UpdateVideoModalVideos() {
    ClearVideoModalVideos();

    if (g_currentDataBlockVideos == null)
        return;

    g_currentDataBlockVideos
        .forEach((item) => {
            AddVideoToVideoModal(item);
        });

    $("#video-modal .videos-list .videos-list__item")
        .click(OnVideoModalVideoClick);
}

function UpdateAudioModal(audioId) {
    let audioModal = $("#audio-modal");
    let currentAudioElement = audioModal.find("#current-audio")[0];

    let currentAudio = g_currentDataBlockAudios
        .find((item) => item.Id == audioId);

    audioModal.find("#current-audio-title").val(currentAudio.Title);
    audioModal.find("#current-audio-desc").val(currentAudio.Description);

    currentAudioElement.src = "Media/Audio/GetFile/" + audioId;
    currentAudioElement.volume = 0.1;

    let privacyElement = audioModal.find(".privacy .privacy__privacy-level")[0];
    SetPrivacyElementPrivacyLevel(privacyElement, currentAudio.Privacy.PrivacyLevel);
    g_editPrivacyId = currentAudio.Privacy.Id;
    LoadPrivacyData(currentAudio.Privacy);
}

function UpdateAudioModalAudioPrivacy() {
    let audioModal = $("#audio-modal");
    let currentAudio = g_currentDataBlockAudios
        .find((item) => item.Id == g_openedAudioId);

    if (currentAudio == null)
        return;

    let privacyElement = audioModal.find(".privacy .privacy__privacy-level")[0];
    SetPrivacyElementPrivacyLevel(privacyElement, currentAudio.Privacy.PrivacyLevel);
}

function RefreshDataCategory() {
    g_currentDataCategory = GetDataCategory(g_currentDataCategory.Id);
}

function RefreshDataCategories() {
    g_dataCategories = GetDataCategories(g_currentPerson.Id);
}

function RefreshDataBlocks() {
    RefreshDataCategory();
}

function RefreshDataHolders() {
    RefreshDataCategory();
    g_currentDataBlock = g_currentDataCategory.DataBlocks
        .find(item => item.Id == g_currentDataBlock.Id);
}

async function RefreshImages() {
    g_currentDataBlockImages = await GetImages(g_currentDataBlock.Id);
}

async function RefreshVideos() {
    g_currentDataBlockVideos = await GetVideos(g_currentDataBlock.Id);
}

async function RefreshAudios() {
    g_currentDataBlockAudios = await GetAudios(g_currentDataBlock.Id);
}

async function RefreshParticipants() {
    g_currentDataBlockParticipants = await GetParticipants(g_currentDataBlock.Id);
}

function OpenDefaultDataBlockTab() {
    $("#person-data-block")
        .find(".data-block-content")
        .find(".tabs-buttons")
        .find(".tab-button-data")
        .click();
}

function ShowDataBlockButtons(isShow = true) {
    $("#person-data-block").find("#back-to-data-blocks-button")[0].style.display = isShow ? "inline-block" : "none";
    $("#person-data-block").find("#tab-button-participants")[0].style.display = isShow ? "" : "none";
}

function ShowDataBlocks(isShow = true) {
    $("#person-data-block").find(".data-blocks")[0].style.display = isShow ? "block" : "none";
    $("#person-data-block").find("#paste-participant-button")[0].style.display = isShow ? "inline-block" : "none";
}

function ShowDataBlockContent(isShow = true) {
    $("#person-data-block").find(".data-block-content")[0].style.display = isShow ? "block" : "none";
}

function ShowDataBlockContentTab(dataBlockContentTab) {
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

function ShowSaveButton(isShow = true) {    
    let saveButton = $("#save-elements-button");

    saveButton.css("display", isShow ? "block" : "none");

    if (IsViewDataBlockAsParticipant()) {
        saveButton.find(".btn__text")[0].innerHTML = "Сохранить копию у участника";
    }
    else {
        saveButton.find(".btn__text")[0].innerHTML = "Сохранить";
    }
}

function ShowEditButton(isShow = true) {
    $("#person-data-block #edit-element-button")
        .css("display", isShow ? "inline-block" : "none");
}

function ShowPrivacyButton(isShow = true) {
    $("#person-data-block #edit-privacy-button")
        .css("display", isShow ? "inline-block" : "none");
}

function SetPrivacyElementPrivacyLevel(element, privacyLevel) {
    let title = "";

    element.classList.remove("privacy-confidential");
    element.classList.remove("privacy-internal-use");
    element.classList.remove("privacy-public-use");
    element.classList.remove("privacy-top-secret");

    switch (privacyLevel) {
        case PrivacyLevels.Confidential: {
            title = "Личный";
            element.classList.add("privacy-confidential");
            break;
        }

        case PrivacyLevels.InternalUse: {
            title = "Внутренний";
            element.classList.add("privacy-internal-use");
            break;
        }

        case PrivacyLevels.PublicUse: {
            title = "Публичный";
            element.classList.add("privacy-public-use");
            break;
        }

        case PrivacyLevels.TopSecret: {
            title = "Строго секретно";
            element.classList.add("privacy-top-secret");
            break;
        }

        default:
            break;
    }

    element.setAttribute("title", title);
    element.setAttribute("data-toggle", "tooltip");
    element.setAttribute("data-placement", "top");
}

function ClearDataCategories() {
    $("#person-data-block").find(".data-categories").empty();
}

function ClearDataBlocks() {
    $("#person-data-block").find(".data-blocks").empty();
}

function ClearDataHolders() {
    $("#person-data-block").find(".data-holders").empty();
}

function ClearImages() {
    $("#person-data-block").find(".images").empty();
}

function ClearVideos() {
    $("#person-data-block").find(".videos").empty();
}

function ClearAudios() {
    $("#person-data-block").find(".audios").empty();
}

function ClearParticipants() {
    $("#person-data-block").find(".participants").empty();
}

function ClearSliderImages() {
    $("#image-carousel-modal")
        .find(".slider")
        .empty();
}

function ClearVideoModalVideos() {
    $("#video-modal .videos-list").empty();
}

function AddItemToDataCategories(dataCategory) {
    let dataCategoryElement = document.createElement("div");
    dataCategoryElement.classList.add("data-categories__item");
    dataCategoryElement.setAttribute("data-id", dataCategory.Id);
    dataCategoryElement.innerHTML = dataCategory.Name;

    let checkboxElement = document.createElement("div");
    checkboxElement.classList.add("checkbox");

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";

    checkboxElement.appendChild(inputElement);
    dataCategoryElement.appendChild(checkboxElement);

    $("#person-data-block")
        .find(".data-categories")[0]
        .appendChild(dataCategoryElement);
}

function AddItemToDataBlocks(dataBlock) {
    let dataBlockElement = document.createElement("div");
    dataBlockElement.classList.add("data-blocks__item");
    dataBlockElement.classList.add("data-block");
    dataBlockElement.setAttribute("data-id", dataBlock.Id);

    let dataBlockHeaderElement = document.createElement("div");
    dataBlockHeaderElement.classList.add("data-block__header");
    let dataBlockFooterElement = document.createElement("div");
    dataBlockFooterElement.classList.add("data-block__footer");
    let dataBlockBodyElement = document.createElement("div");
    dataBlockBodyElement.classList.add("data-block__body");

    let dataBlockSelectorElement = document.createElement("div");
    dataBlockSelectorElement.classList.add("data-block__selector");
    let checkboxElement = document.createElement("div");
    checkboxElement.classList.add("checkbox");
    let checkboxInputElement = document.createElement("input");
    checkboxInputElement.type = "checkbox";
    checkboxElement.appendChild(checkboxInputElement);
    dataBlockSelectorElement.appendChild(checkboxElement);

    let dataBlockContentElement = document.createElement("div");
    dataBlockContentElement.classList.add("data-block__content");

    let dataBlockItemElement = document.createElement("div");
    dataBlockItemElement.classList.add("data-block__item");

    let dataBlockTitleElement = document.createElement("div");
    dataBlockTitleElement.classList.add("data-block__title");
    dataBlockTitleElement.innerHTML = dataBlock.Title;

    dataBlockItemElement.appendChild(dataBlockTitleElement);

    dataBlockContentElement.appendChild(dataBlockItemElement);

    dataBlockBodyElement.appendChild(dataBlockSelectorElement);
    dataBlockBodyElement.appendChild(dataBlockContentElement);

    dataBlockElement.appendChild(dataBlockHeaderElement);
    dataBlockElement.appendChild(dataBlockBodyElement);
    dataBlockElement.appendChild(dataBlockFooterElement);

    $("#person-data-block")
        .find(".data-blocks")[0]
        .appendChild(dataBlockElement);
}

function AddItemToDataHolders(dataHolder) {
    let dataHolderElement = null;

    switch (dataHolder.DataHolderType) {
        case DataHolderTypes.Text : {
            dataHolderElement = CreateTextDataHolderElement(dataHolder);
            break;
        }        
        case DataHolderTypes.TextArea: {
            dataHolderElement = CreateTextAreaDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.Date : {
            dataHolderElement = CreateDateDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.DateTime : {
            dataHolderElement = CreateDateTimeDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.Time : {
            dataHolderElement = CreateTimeDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.Name: {
            dataHolderElement = CreateTextDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.Surname: {
            dataHolderElement = CreateTextDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.MiddleName: {
            dataHolderElement = CreateTextDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.Birthday: {
            dataHolderElement = CreateDateDataHolderElement(dataHolder);
            break;
        }
        case DataHolderTypes.Gender: {
            dataHolderElement = CreateGenderDataHolderElement(dataHolder);
            break;
        }
        default:
            return;
    }

    $("#person-data-block")
        .find(".data-holders")[0]
        .appendChild(dataHolderElement);

    if (dataHolder.DataHolderType == DataHolderTypes.Gender) {    
        switch (dataHolder.Data) {
            case GenderTypes.Male: {
                $(dataHolderElement).find("input[type=\"radio\"][value=\"Male\"]").prop("checked", true);
                break;
            }
            case GenderTypes.Female: {
                $(dataHolderElement).find("input[type=\"radio\"][value=\"Female\"]").prop("checked", true);
                break;
            }
            case GenderTypes.Unknown: {
                $(dataHolderElement).find("input[type=\"radio\"][value=\"Unknown\"]").prop("checked", true);
                break;
            }

            default:
                break;
        }
    }
}

function AddItemToImages(image) {
    let imageElement = document.createElement("div");
    imageElement.classList.add("image");
    imageElement.classList.add("images__item");
    imageElement.setAttribute("data-id", image.Id);

    let selectorElement = document.createElement("div");
    selectorElement.classList.add("image__selector");

    let checkboxElement = document.createElement("div");
    checkboxElement.classList.add("checkbox");

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";

    checkboxElement.appendChild(inputElement);
    selectorElement.appendChild(checkboxElement);

    let imgElement = document.createElement("img");
    imgElement.src = "/Media/Image/GetFile/" + image.Id;
    imgElement.decoding = "async";

    imageElement.appendChild(selectorElement);
    imageElement.appendChild(imgElement);

    $("#person-data-block")
        .find(".images")[0]
        .appendChild(imageElement);
}

function AddItemToParticipant(participant) {
    let participantElement = document.createElement("div");
    participantElement.classList.add("participant");
    participantElement.classList.add(participant.IsOwner ? "owner__item" : "participants__item");
    participantElement.setAttribute("data-id", participant.Id);

        let imgElement = document.createElement("img");

        let selectorElement = document.createElement("div");
        selectorElement.classList.add("participant__selector");
        let checkboxElement = document.createElement("div");
        checkboxElement.classList.add("checkbox");
        let inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.disabled = participant.IsOwner;
        checkboxElement.appendChild(inputElement);
        selectorElement.appendChild(checkboxElement);

        let infoElement = document.createElement("div");
            let surnameElement = document.createElement("div");
            surnameElement.classList.add("surname");
            let nameElement = document.createElement("div");
            nameElement.classList.add("name");
            let middlenameElement = document.createElement("div");
            middlenameElement.classList.add("middlename");
            let birthdayElement = document.createElement("div");
            birthdayElement.classList.add("birthday");
        infoElement.classList.add("participant_info");
        infoElement.appendChild(surnameElement);
        infoElement.appendChild(nameElement);
        infoElement.appendChild(middlenameElement);
        infoElement.appendChild(birthdayElement);

    participantElement.appendChild(selectorElement);
    participantElement.appendChild(imgElement);
    participantElement.appendChild(infoElement);

    FillParticipant(participantElement, participant);

    $("#person-data-block")
        .find(".participants")[0]
        .appendChild(participantElement);
}


function AddItemToVideos(video) {
    let videoElement = document.createElement("div");
    videoElement.classList.add("video");
    videoElement.classList.add("videos__item");
    videoElement.setAttribute("data-id", video.Id);

    let selectorElement = document.createElement("div");
    selectorElement.classList.add("video__selector");

    let checkboxElement = document.createElement("div");
    checkboxElement.classList.add("checkbox");

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";

    checkboxElement.appendChild(inputElement);
    selectorElement.appendChild(checkboxElement);

    let imgElement = document.createElement("img");
    imgElement.src = "data:image/" + video.PreviewImageType + ";base64," + video.PreviewImageData;

    videoElement.appendChild(selectorElement);
    videoElement.appendChild(imgElement);

    $("#person-data-block")
        .find(".videos")[0]
        .appendChild(videoElement);
}

function AddItemToAudios(audio) {
    let audioElement = document.createElement("div");
    audioElement.classList.add("audio");
    audioElement.classList.add("audios__item");
    audioElement.setAttribute("data-id", audio.Id);

    let selectorElement = document.createElement("div");
    selectorElement.classList.add("audio__selector");

    let checkboxElement = document.createElement("div");
    checkboxElement.classList.add("checkbox");

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";

    checkboxElement.appendChild(inputElement);
    selectorElement.appendChild(checkboxElement);

    let playButtonElement = document.createElement("div");
    playButtonElement.classList.add("audio__play");
    playButtonElement.classList.add("btn");
    playButtonElement.classList.add("btn-default");

    let playButtonImgElement = document.createElement("img");
    playButtonImgElement.src = "/images/play.svg";

    playButtonElement.appendChild(playButtonImgElement);

    let titleElement = document.createElement("div");
    titleElement.classList.add("audio__title");
    titleElement.innerHTML = audio.Title;

    audioElement.appendChild(selectorElement);
    audioElement.appendChild(playButtonElement);
    audioElement.appendChild(titleElement);

    $("#person-data-block")
        .find(".audios")[0]
        .appendChild(audioElement);
}

function AddImageToSlider(image) {
    let slider = $("#image-carousel-modal")
        .find(".slider")[0];

    let imgElement = document.createElement("img");
    imgElement.src = "/Media/Image/GetFile/" + image.Id;
    imgElement.decoding = "async";
    imgElement.setAttribute("data-id", image.Id);

    slider.appendChild(imgElement);
}

function AddVideoToVideoModal(video) {
    let videosList = $("#video-modal .videos-list");

    let videosLitsItemElement = $(document.createElement("div"));
    videosLitsItemElement.addClass("videos-list__item");
    videosLitsItemElement.addClass("video-info");
    videosLitsItemElement.attr("data-id", video.Id);

    let videoPreviewImage = $(document.createElement("div"));
    videoPreviewImage.addClass("video-info__preview-image");

    let imgElement = document.createElement("img");
    imgElement.src = "data:image/" + video.PreviewImageType + ";base64," + video.PreviewImageData;

    videoPreviewImage.append(imgElement);

    let videoTitleElement = document.createElement("div");
    videoTitleElement.classList.add("video-info__title");
    videoTitleElement.innerHTML = video.Title;

    videosLitsItemElement.append(videoPreviewImage);
    videosLitsItemElement.append(videoTitleElement);

    videosList.append(videosLitsItemElement);
}

function CreateDataHolderElement(dataHolder) {
    let dataHolderElement = document.createElement("div");
    dataHolderElement.classList.add("data-holders__item");
    dataHolderElement.classList.add("data-holder");
    dataHolderElement.setAttribute("data-id", dataHolder.Id);
    return dataHolderElement;
}

function CreateDataHolderSelectorElement(dataHolder) {
    let dataHolderSelectorElement = document.createElement("div");
    dataHolderSelectorElement.classList.add("data-holder__selector");

    let checkboxElement = document.createElement("div");
    checkboxElement.classList.add("checkbox");
    let checkboxInputElement = document.createElement("input");
    checkboxInputElement.type = "checkbox";

    checkboxElement.appendChild(checkboxInputElement);
    dataHolderSelectorElement.appendChild(checkboxElement);   

    return dataHolderSelectorElement;
}

function CreateDataHolderTitleElement(dataHolder) {
    let dataHolderTitleElement = document.createElement("div");
    dataHolderTitleElement.classList.add("data-holder__title");
    let titleElement = document.createElement("div");
    titleElement.innerHTML = dataHolder.Title;
    dataHolderTitleElement.appendChild(titleElement);

    return dataHolderTitleElement;
}

function CreateDataHolderDataElement() {
    let dataHolderDataElement = document.createElement("div");
    dataHolderDataElement.classList.add("data-holder__data");

    return dataHolderDataElement;
}

function CreateDataHolderPrivacyElement(dataHolder) {
    let dataHolderPrivacyElement = document.createElement("div");
    dataHolderPrivacyElement.classList.add("data-holder__privacy");
    dataHolderPrivacyElement.setAttribute("data-toggle", "tooltip");
    dataHolderPrivacyElement.setAttribute("data-placement", "right");

    let title = "";

    if (dataHolder.Privacy == null) {
        title = "Личный";
        dataHolderPrivacyElement.classList.add("privacy-confidential");
    }
    else {
        switch (dataHolder.Privacy.PrivacyLevel) {
            case PrivacyLevels.Confidential: {
                title = "Личный";
                dataHolderPrivacyElement.classList.add("privacy-confidential");
                break;
            }

            case PrivacyLevels.InternalUse: {
                title = "Внутренний";
                dataHolderPrivacyElement.classList.add("privacy-internal-use");
                break;
            }

            case PrivacyLevels.PublicUse: {
                title = "Публичный";
                dataHolderPrivacyElement.classList.add("privacy-public-use");
                break;
            }

            case PrivacyLevels.TopSecret: {
                title = "Строго секретно";
                dataHolderPrivacyElement.classList.add("privacy-top-secret");
                break;
            }

            default:
                break;
        }
    }

    dataHolderPrivacyElement.setAttribute("title", title);

    return dataHolderPrivacyElement;
}

function CreateTextDataHolderElement(dataHolder) {
    let dataHolderElement = CreateDataHolderElement(dataHolder);  

    let dataHolderDataElement = CreateDataHolderDataElement();
    let inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = dataHolder.Data;
    dataHolderDataElement.appendChild(inputElement);

    dataHolderElement.appendChild(CreateDataHolderSelectorElement(dataHolder));
    dataHolderElement.appendChild(CreateDataHolderTitleElement(dataHolder));
    dataHolderElement.appendChild(dataHolderDataElement);
    dataHolderElement.appendChild(CreateDataHolderPrivacyElement(dataHolder));

    return dataHolderElement;
}

function CreateTextAreaDataHolderElement(dataHolder) {
    let dataHolderElement = CreateDataHolderElement(dataHolder);
    dataHolderElement.classList.replace("data-holder", "data-holder-textarea");

    let dataHolderSelectorElement = CreateDataHolderSelectorElement(dataHolder);
    dataHolderSelectorElement.classList.replace("data-holder__selector", "data-holder-textarea__selector");

    let dataHolderTitleElement = CreateDataHolderTitleElement(dataHolder);
    dataHolderTitleElement.classList.replace("data-holder__title", "data-holder-textarea__title");

    let dataHolderDataElement = CreateDataHolderDataElement();
    dataHolderDataElement.classList.replace("data-holder__data", "data-holder-textarea__data");

    let textAreaElement = document.createElement("textarea");
    textAreaElement.value = dataHolder.Data;
    textAreaElement.setAttribute("rows", "6");
    dataHolderDataElement.appendChild(textAreaElement);

    let dataHolderPrivacyElement = CreateDataHolderPrivacyElement(dataHolder);
    dataHolderPrivacyElement.classList.replace("data-holder__privacy", "data-holder-textarea__privacy");

    dataHolderElement.appendChild(dataHolderSelectorElement);
    dataHolderElement.appendChild(dataHolderTitleElement);
    dataHolderElement.appendChild(dataHolderPrivacyElement);
    dataHolderElement.appendChild(dataHolderDataElement);

    return dataHolderElement;
}

function CreateDateDataHolderElement(dataHolder) {
    let dataHolderElement = CreateDataHolderElement(dataHolder);

    let dataHolderDataElement = CreateDataHolderDataElement();
    let inputElement = document.createElement("input");
    inputElement.type = "date";

    inputElement.value = dataHolder.Data
        ? moment(dataHolder.Data, getFormat(dataHolder.Data))
            .format()
            .split('T')[0]
        : 0;

    dataHolderDataElement.appendChild(inputElement);

    dataHolderElement.appendChild(CreateDataHolderSelectorElement(dataHolder));
    dataHolderElement.appendChild(CreateDataHolderTitleElement(dataHolder));
    dataHolderElement.appendChild(dataHolderDataElement);
    dataHolderElement.appendChild(CreateDataHolderPrivacyElement(dataHolder));

    return dataHolderElement;

    function getFormat(d){
        const dateFormats = {
            "iso_int" : "YYYY-MM-DD",
            "short_date" : "DD/MM/YYYY",
            "iso_date_time": "YYYY-MM-DDTHH:MM:SS",
            "iso_date_time_utc": "YYYY-MM-DDTHH:MM:SSZ"
        }          
        for (var prop in dateFormats) {
              if(moment(d, dateFormats[prop],true).isValid()){
                 return dateFormats[prop];
              }
        }
        return null;
    }
}

function CreateDateTimeDataHolderElement(dataHolder) {
    let dataHolderElement = CreateDataHolderElement(dataHolder);

    let dataHolderDataElement = CreateDataHolderDataElement();
    let inputElement = document.createElement("input");
    inputElement.type = "datetime-local";
    inputElement.value = dataHolder.Data;
    dataHolderDataElement.appendChild(inputElement);

    dataHolderElement.appendChild(CreateDataHolderSelectorElement(dataHolder));
    dataHolderElement.appendChild(CreateDataHolderTitleElement(dataHolder));
    dataHolderElement.appendChild(dataHolderDataElement);
    dataHolderElement.appendChild(CreateDataHolderPrivacyElement(dataHolder));

    return dataHolderElement;
}

function CreateTimeDataHolderElement(dataHolder) {
    let dataHolderElement = CreateDataHolderElement(dataHolder);

    let dataHolderDataElement = CreateDataHolderDataElement();
    let inputElement = document.createElement("input");
    inputElement.type = "time";
    inputElement.value = dataHolder.Data;
    dataHolderDataElement.appendChild(inputElement);

    dataHolderElement.appendChild(CreateDataHolderSelectorElement(dataHolder));
    dataHolderElement.appendChild(CreateDataHolderTitleElement(dataHolder));
    dataHolderElement.appendChild(dataHolderDataElement);
    dataHolderElement.appendChild(CreateDataHolderPrivacyElement(dataHolder));

    return dataHolderElement;
}

function CreateGenderDataHolderElement(dataHolder) {
    let dataHolderElement = CreateDataHolderElement(dataHolder);
    dataHolderElement.classList.replace("data-holder", "data-holder-gender");

    let dataHolderSelectorElement = CreateDataHolderSelectorElement(dataHolder);
    dataHolderSelectorElement.classList.replace("data-holder__selector", "data-holder-gender__selector");

    let dataHolderTitleElement = CreateDataHolderTitleElement(dataHolder);
    dataHolderTitleElement.classList.replace("data-holder__title", "data-holder-gender__title");

    let dataHolderDataElement = CreateDataHolderDataElement();
    dataHolderDataElement.classList.replace("data-holder__data", "data-holder-gender__data");

    let buttonGroupElement = document.createElement("div");
    buttonGroupElement.classList.add("btn-group");
    buttonGroupElement.classList.add("btn-group-toggle");
    buttonGroupElement.setAttribute("data-toggle", "buttons");

    let labelsElements = [];
    labelsElements.push(document.createElement("label"));
    labelsElements.push(document.createElement("label"));
    labelsElements.push(document.createElement("label"));

    $(labelsElements).addClass("btn").addClass("btn-default");

    let inputElements = [];
    inputElements.push(document.createElement("input"));
    inputElements.push(document.createElement("input"));
    inputElements.push(document.createElement("input"));

    inputElements[0].type = "radio";
    inputElements[0].name = "person-gender";
    inputElements[0].value = "Male";

    inputElements[1].type = "radio";
    inputElements[1].name = "person-gender";
    inputElements[1].value = "Female";

    inputElements[2].type = "radio";
    inputElements[2].name = "person-gender";
    inputElements[2].value = "Unknown";

    labelsElements[0].appendChild(inputElements[0]);
    labelsElements[0].innerHTML += "Мужчина";
    labelsElements[1].appendChild(inputElements[1]);
    labelsElements[1].innerHTML += "Женщина";
    labelsElements[2].appendChild(inputElements[2]);
    labelsElements[2].innerHTML += "Неизвестно";

    buttonGroupElement.appendChild(labelsElements[0]);
    buttonGroupElement.appendChild(labelsElements[1]);
    buttonGroupElement.appendChild(labelsElements[2]);

    dataHolderDataElement.appendChild(buttonGroupElement);

    let dataHolderPrivacyElement = CreateDataHolderPrivacyElement(dataHolder);
    dataHolderPrivacyElement.classList.replace("data-holder__privacy", "data-holder-gender__privacy");

    dataHolderElement.appendChild(dataHolderSelectorElement);
    dataHolderElement.appendChild(dataHolderTitleElement);
    dataHolderElement.appendChild(dataHolderDataElement);
    dataHolderElement.appendChild(dataHolderPrivacyElement);

    switch (dataHolder.Data) {
        case GenderTypes.Male: {
            labelsElements[0].classList.add("active");
            break;
        }
        case GenderTypes.Female: {
            labelsElements[1].classList.add("active");
            break;
        }
        case GenderTypes.Unknown: {
            labelsElements[2].classList.add("active");
            break;
        }

        default:
            break;
    }

    return dataHolderElement;
}

//Other
function GetSelectedDataCategoriesIds() {
    let result = [];

    $("#person-data-block")
        .find(".data-categories .data-categories__item")
        .each((i, el) => {
            if ($(el).find("input[type=\"checkbox\"]").is(":checked")) {
                result.push(el.getAttribute("data-id"));
            }
        });

    return result;
}

function GetSelectedDataBlocksIds() {
    let result = [];

    $("#person-data-block")
        .find(".data-blocks .data-blocks__item")
        .each((i, el) => {
            if ($(el).find("input[type=\"checkbox\"]").is(":checked")) {
                result.push(el.getAttribute("data-id"));
            }
        });

    return result;
}

function GetSelectedDataHoldersIds() {
    let result = [];

    $("#person-data-block")
        .find(".data-holders .data-holders__item")
        .each((i, el) => {
            if ($(el).find("input[type=\"checkbox\"]").is(":checked")) {
                result.push(el.getAttribute("data-id"));
            }
        });

    return result;
}

function GetSelectedImagesIds() {
    let result = [];

    $("#person-data-block")
        .find(".images .images__item")
        .each((i, el) => {
            if ($(el).find("input[type=\"checkbox\"]").is(":checked")) {
                result.push(el.getAttribute("data-id"));
            }
        });

    return result;
}

function GetSelectedVideosIds() {
    let result = [];

    $("#person-data-block")
        .find(".videos .videos__item")
        .each((i, el) => {
            if ($(el).find("input[type=\"checkbox\"]").is(":checked")) {
                result.push(el.getAttribute("data-id"));
            }
        });

    return result;
}

function GetSelectedAudiosIds() {
    let result = [];

    $("#person-data-block")
        .find(".audios .audios__item")
        .each((i, el) => {
            if ($(el).find("input[type=\"checkbox\"]").is(":checked")) {
                result.push(el.getAttribute("data-id"));
            }
        });

    return result;
}

function GetSelectedParticipantIds() {
    let result = [];

    $("#person-data-block")
        .find(".participants .participants__item")
        .each((i, el) => {
            if ($(el).find("input[type=\"checkbox\"]").is(":checked")) {
                result.push(parseInt(el.getAttribute("data-id")));
            }
        });

    return result;
}

function GetImageSliderCurrentImageId() {
    return $("#image-carousel-modal")
        .find(".slider .slick-current")
        .attr("data-id");
}

function GetVideoModalCurrentVideoId() {
    return $("#video-modal .videos-list .videos-list__item_active")
        .attr("data-id");
}

function GetPartModalCurrentPartId() {
    return $("#part-modal .part-list .part-list__item_active")
        .attr("data-id");
}

function GetCurrentActionTypeElements() {
    let elements = null;
    let personDataBlock = $("#person-data-block");
    switch (g_currentAddButtonActionType) {
        case AddButtonActionTypes.AddDataBlock: {
            elements = personDataBlock.find(".data-blocks .data-blocks__item");
            break;
        }
        case AddButtonActionTypes.AddDataHolder: {
            elements = personDataBlock.find(".data-holders .data-holders__item");
            break;
        }
        case AddButtonActionTypes.AddImage: {
            elements = personDataBlock.find(".images .images__item");
            break;
        }
        case AddButtonActionTypes.AddVideo: {
            elements = personDataBlock.find(".videos .videos__item");
            break;
        }
        case AddButtonActionTypes.AddAudio: {
            elements = personDataBlock.find(".audios .audios__item");
            break;
        }
        case AddButtonActionTypes.AddParticipant: {
            elements = personDataBlock.find(".participants .participants__item");
            break;
        }

        default:
            return;
    }

    return elements;
}

function CopySelectedDataCategories() {
    g_copyObject.Ids = GetSelectedDataCategoriesIds();
    g_copyObject.CopyObjectType = CopyObjectTypes.DataCategory;
    sessionStorage.setItem(CopyObjectSessionStorageKey, JSON.stringify(g_copyObject));
}

function CopySelectedDataBlocks() {    
    g_copyObject.Ids = GetSelectedDataBlocksIds();
    g_copyObject.CopyObjectType = CopyObjectTypes.DataBlock;
    sessionStorage.setItem(CopyObjectSessionStorageKey, JSON.stringify(g_copyObject));
}

function CopySelectedDataHolders() {
    g_copyObject.Ids = GetSelectedDataHoldersIds();
    g_copyObject.CopyObjectType = CopyObjectTypes.DataHolder;
    sessionStorage.setItem(CopyObjectSessionStorageKey, JSON.stringify(g_copyObject));
}

function CopySelectedImages() {
    g_copyObject.Ids = GetSelectedImagesIds();
    g_copyObject.CopyObjectType = CopyObjectTypes.Image;
    sessionStorage.setItem(CopyObjectSessionStorageKey, JSON.stringify(g_copyObject));
}

function CopySelectedVideos() {
    g_copyObject.Ids = GetSelectedVideosIds();
    g_copyObject.CopyObjectType = CopyObjectTypes.Video;
    sessionStorage.setItem(CopyObjectSessionStorageKey, JSON.stringify(g_copyObject));
}

function CopySelectedAudios() {
    g_copyObject.Ids = GetSelectedAudiosIds();
    g_copyObject.CopyObjectType = CopyObjectTypes.Audio;
    sessionStorage.setItem(CopyObjectSessionStorageKey, JSON.stringify(g_copyObject));
}

async function SelectParticipant() {
    if (!g_currentDataBlockIdsToAssignParticipant || !g_currentDataBlockIdsToAssignParticipant.length)
        return;

    const result = await $.ajax({
        type: "POST",
        data: {
            participantId: g_currentPerson.Id,
            dataBlockIds: g_currentDataBlockIdsToAssignParticipant,
        },
        url: "/PersonContent/DataBlock/InsertParticipants",
    });

    return result;
}

function PasteDataCategories() {
    g_copyObject = JSON.parse(sessionStorage.getItem(CopyObjectSessionStorageKey));

    if (g_copyObject == null ||
        g_copyObject.Ids.length == 0)
        return;

    if (g_copyObject.CopyObjectType == null ||
        g_copyObject.CopyObjectType != CopyObjectTypes.DataCategory) {
        alert("Ошибка при вставке из буфера (неверный тип объектов)");
        return;
    }

    if (!CopyDataCategories(g_copyObject.Ids, g_currentPerson.Id)) {
        alert("Ошибка при вставке из буфера");
        return;
    }

    RefreshDataCategories()
    UpdateDataCategories();
}

function PasteDataBlocks() {
    g_copyObject = JSON.parse(sessionStorage.getItem(CopyObjectSessionStorageKey));

    if (g_copyObject == null ||
        g_copyObject.Ids.length == 0)
        return;

    if (g_copyObject.CopyObjectType == null ||
        g_copyObject.CopyObjectType != CopyObjectTypes.DataBlock) {
        alert("Ошибка при вставке из буфера (неверный тип объектов)");
        return;
    }

    if (!CopyDataBlocks(g_copyObject.Ids, g_currentDataCategory.Id)) {
        alert("Ошибка при вставке из буфера");
        return;
    }

    RefreshDataBlocks();
    UpdateDataBlocks();
}

function PasteDataHolders() {
    g_copyObject = JSON.parse(sessionStorage.getItem(CopyObjectSessionStorageKey));

    if (g_copyObject == null ||
        g_copyObject.Ids.length == 0)
        return;

    if (g_copyObject.CopyObjectType == null ||
        g_copyObject.CopyObjectType != CopyObjectTypes.DataHolder) {
        alert("Ошибка при вставке из буфера (неверный тип объектов)");
        return;
    }

    if (!CopyDataHolders(g_copyObject.Ids, g_currentDataBlock.Id)) {
        alert("Ошибка при вставке из буфера");
        return;
    }

    RefreshDataHolders();
    UpdateDataHolders();
}

function PasteImages() {
    g_copyObject = JSON.parse(sessionStorage.getItem(CopyObjectSessionStorageKey));

    if (g_copyObject == null ||
        g_copyObject.Ids.length == 0)
        return;

    if (g_copyObject.CopyObjectType == null ||
        g_copyObject.CopyObjectType != CopyObjectTypes.Image) {
        alert("Ошибка при вставке из буфера (неверный тип объектов)");
        return;
    }

    CopyImages(g_copyObject.Ids, g_currentDataBlock.Id)
        .then((data) => {
            RefreshImages().then((val) => UpdateImages());
        },
        (r) => { 
            alert("Ошибка при вставке из буфера");
        });    
}

function PasteVideos() {
    g_copyObject = JSON.parse(sessionStorage.getItem(CopyObjectSessionStorageKey));

    if (g_copyObject == null ||
        g_copyObject.Ids.length == 0)
        return;

    if (g_copyObject.CopyObjectType == null ||
        g_copyObject.CopyObjectType != CopyObjectTypes.Video) {
        alert("Ошибка при вставке из буфера (неверный тип объектов)");
        return;
    }

    CopyVideos(g_copyObject.Ids, g_currentDataBlock.Id)
        .then((data) => {
            RefreshVideos().then((val) => UpdateVideos());
        },
        (r) => {
            alert("Ошибка при вставке из буфера");
        });  
}

function PasteAudios() {
    g_copyObject = JSON.parse(sessionStorage.getItem(CopyObjectSessionStorageKey));

    if (g_copyObject == null ||
        g_copyObject.Ids.length == 0)
        return;

    if (g_copyObject.CopyObjectType == null ||
        g_copyObject.CopyObjectType != CopyObjectTypes.Audio) {
        alert("Ошибка при вставке из буфера (неверный тип объектов)");
        return;
    }

    CopyAudios(g_copyObject.Ids, g_currentDataBlock.Id)
        .then((data) => {
            RefreshAudios().then((val) => UpdateAudios());
        },
        (r) => {
            alert("Ошибка при вставке из буфера");
        });
}

function SelectVideoModalVideo(videoId) {
    let videosListElement = $("#video-modal .videos-list");

    videosListElement
        .children()
        .removeClass("videos-list__item_active");

    videosListElement
        .find(".videos-list__item[data-id=\"" + videoId + "\"]")
        .addClass("videos-list__item_active");
}

function SelectAllCheckboxes(elements) {
    $(elements).find("input[type=\"checkbox\"]").prop("checked", true);
}

function DeselectAllCheckboxes(elements) {
    $(elements).find("input[type=\"checkbox\"]").prop("checked", false);
}

function InverseSelectCheckboxes(elements) {
    $(elements).find("input[type=\"checkbox\"]").each((i, el) => {
        $(el).prop("checked", $(el).prop("checked") == true ? false : true);
    });
}

async function DeleteSelectedDataCategories() {
    let dataCategeoriesIds = GetSelectedDataCategoriesIds();

    if (dataCategeoriesIds.length == 0)
        return;

    for (let i = 0; i < dataCategeoriesIds.length; i++) {
        await DeleteDataCategory(dataCategeoriesIds[i]);
    }
}

async function DeleteSelectedDataBlocks() {
    let dataBlocksIds = GetSelectedDataBlocksIds();

    if (dataBlocksIds.length == 0)
        return;

    for (let i = 0; i < dataBlocksIds.length; i++) {
        await DeleteDataBlock(dataBlocksIds[i]);
    }
}

async function DeleteSelectedDataHolders() {
    let dataHoldersIds = GetSelectedDataHoldersIds();

    if (dataHoldersIds.length == 0)
        return;

    for (let i = 0; i < dataHoldersIds.length; i++) {
        await DeleteDataHolder(dataHoldersIds[i]);
    }
}

async function DeleteSelectedImages() {
    let imagesIds = GetSelectedImagesIds();

    if (imagesIds.length == 0)
        return;

    const promises = imagesIds.map(DeleteImage);

    await Promise.all(promises);
}

async function DeleteSelectedVideos() {
    let videosIds = GetSelectedVideosIds();

    if (videosIds.length == 0)
        return;
    
    const promises = videosIds.map(DeleteVideo);

    await Promise.all(promises);
}

async function DeleteSelectedAudios() {
    let audiosIds = GetSelectedAudiosIds();

    if (audiosIds.length == 0)
        return;

    const promises = audiosIds.map(DeleteAudio);

    await Promise.all(promises);
}

async function DeleteSelectedParticipants() {
    let participantIds = GetSelectedParticipantIds();

    if (participantIds.length == 0)
        return;

    let debug = participantIds.indexOf(g_currentDataBlockParticipants[0].Id);

    g_currentDataBlockParticipants =
        g_currentDataBlockParticipants
            .filter(x => participantIds.indexOf(x.Id) < 0);

    CreateParticipants()
    .then((res) => RefreshParticipants()
    .then((val) => UpdateParticipants()));
}

function IsViewDataBlockAsParticipant() {
    return g_currentDataBlockParticipants && g_currentDataBlockParticipants.filter(x => !x.IsOwner).map(x => x.Id).indexOf(g_currentPerson.Id) >= 0;
}