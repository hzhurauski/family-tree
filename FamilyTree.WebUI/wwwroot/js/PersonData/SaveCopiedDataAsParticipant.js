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
        await window.WaitForMilliseconds(1500);
    },
    (r) => {
        alert("Произошла ошибка во время сохранения.");
    })})});

    saveButton.find(".btn__text")[0].innerHTML = "Сохранить";
    saveButton.removeClass("btn-success");
    saveButton.addClass("btn-default");
}