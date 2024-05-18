import { ReloadTree } from "../LoadTree/LoadTree.js";
import { CopyDataBlocks } from "./CopyDataBlocks.js";
import { DeleteParticipant } from "./DeleteParticipant.js";
import { GetDataCategory } from "./GetDataCategory.js";
import { RefreshDataBlock } from "./RefreshDataBlock.js";
import { SaveDataHolders } from "./SaveDataHolders.js";
import { UpdateDataHolderIds } from "./UpdateDataHolderIds.js";

export async function SaveCopiedDataAsParticipant() {
    let saveButton = $("#save-elements-button");
    saveButton.find(".loader").css("display", "block");
    saveButton.find(".btn__text")[0].innerHTML = "Сохранение";

    let createdDataholdersByDataBlockIds;

    await CopyDataBlocks([ window.g_currentDataBlock.Id ], window.g_currentDataCategory.Id)
    .then(async (data) => {
        createdDataholdersByDataBlockIds = data[0];
        await DeleteParticipant(window.g_currentPerson.Id, window.g_currentDataBlock.Id)
    .then(async (data) => {
        UpdateDataHolderIds(createdDataholdersByDataBlockIds.DataHolders);
        await SaveDataHolders()
    .then(async (data) => {
        window.g_currentDataCategory = GetDataCategory(window.g_currentDataCategory.Id);  
        RefreshDataBlock(createdDataholdersByDataBlockIds.Id);

        if (window.g_currentDataCategory.DataCategoryType == window.DataCategoryTypes.PersonInfo)
            ReloadTree($("#mainPerson")[0].getAttribute("data-value"));

        saveButton.find(".loader").css("display", "none");
        saveButton.find(".btn__text")[0].innerHTML = "Сохранено";
        saveButton.removeClass("btn-default");
        saveButton.addClass("btn-success");
        await window.WaitForMilliseconds(1500);
    },
    (r) => {
        alert("Произошла ошибка во время сохранения.");
    })})});

    saveButton.find(".btn__text")[0].innerHTML = "Сохранить";
    saveButton.removeClass("btn-success");
    saveButton.addClass("btn-default");
}