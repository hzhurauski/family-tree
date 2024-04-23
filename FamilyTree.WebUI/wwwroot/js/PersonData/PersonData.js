import { InitPersonDataBlockButtonEvents } from "./InitPersonDataBlockButtonEvents.js";

$(window).load(() => {
    InitPersonDataBlockButtonEvents();
});

window.DataCategoryTypes = {
    InfoBlock: 0,
    ListBlock: 1,
    PersonInfo: 2,
    Education: 3,
    Residencies: 4,
    LaborActivities: 5,
    ImportantEvents: 6   
};
window.DataHolderTypes = {
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
window.DataBlockContentTabs = {
    Data: 0,
    Images: 1,
    Videos: 2,
    Audios: 3,
    Participants: 4,
};
window.GenderTypes = {
    Unknown: "Unknown",
    Male: "Male",
    Female: "Female"
}
window.AddButtonActionTypes = {
    AddDataBlock: 0,
    AddDataHolder: 1,
    AddImage: 2,
    AddVideo: 3,
    AddAudio: 4,
    AddParticipant: 5,
};
window.PrivacyLevels = {
    TopSecret: 0,
    Confidential: 1,
    InternalUse: 2,
    PublicUse: 3
};
window.CopyObjectTypes = {
    DataCategory: 0,
    DataBlock: 1,
    DataHolder: 2,
    Image: 3,
    Video: 4,
    Audio: 5,
    Participant: 6
};
window.CopyObjectSessionStorageKey = "COPY_OBJECT";

window.WaitForMilliseconds = (ms) => new Promise(handler => setTimeout(handler, ms));

window.g_currentPerson = null;
window.g_dataCategories = [];
window.g_currentDataCategory = null;
window.g_currentDataBlock = null;
window.g_currentDataBlockImages = null;
window.g_currentDataBlockVideos = null;
window.g_currentDataBlockAudios = null;
window.g_currentDataBlockParticipants = null;
window.g_openedAudioId = null;
window.g_currentAddButtonActionType = null;
window.g_editElementId = null;
window.g_isSaving = false;
window.g_copyObject = {
    Ids: [0],
    CopyObjectType: 0
};
window.g_isUploadingImage = false;
window.g_isUploadingVideo = false;
window.g_isUploadingAudio = false;
window.g_currentDataBlockIdsToAssignParticipant = null;

/**
 * Send request to create DataCategory. Returns created DataCategory object Id or -1, if not created.
 * @param {object} dataCategory Object { CategoryType: string, Name: string, PersonId: number }
 * @returns {number}
 */