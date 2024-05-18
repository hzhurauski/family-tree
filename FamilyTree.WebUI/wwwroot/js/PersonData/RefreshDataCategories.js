import { GetDataCategories } from "./GetDataCategories.js";

export function RefreshDataCategories() {
    window.g_dataCategories = GetDataCategories(window.g_currentPerson.Id);
}
