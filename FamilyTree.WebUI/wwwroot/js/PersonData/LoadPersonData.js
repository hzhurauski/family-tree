import { GetPersonData } from "./GetPersonData.js";
import { RefreshDataCategories } from "./RefreshDataCategories.js";
import { UpdateDataCategories } from "./UpdateDataCategories.js";

export async  function LoadPersonData(personId) {
    window.g_currentPerson = await GetPersonData(personId).catch((r) => {
        window.g_currentPerson = null;
    });

    if (window.g_currentPerson == null)
        return false;

    RefreshDataCategories();

    if (window.g_dataCategories.length === 0)
        return false;

    UpdateDataCategories();

    $("#person-data-block")
        .find(".data-categories")
        .find(".data-categories__item")[0]
        .click();

    return true;
}