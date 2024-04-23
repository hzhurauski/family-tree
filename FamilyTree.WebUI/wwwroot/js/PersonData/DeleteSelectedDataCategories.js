import { DeleteDataCategory } from "./DeleteDataCategory.js";
import { GetSelectedDataCategoriesIds } from "./GetSelectedDataCategoriesIds.js";

export async function DeleteSelectedDataCategories() {
    let dataCategeoriesIds = GetSelectedDataCategoriesIds();

    if (dataCategeoriesIds.length == 0)
        return;

    for (let i = 0; i < dataCategeoriesIds.length; i++) {
        await DeleteDataCategory(dataCategeoriesIds[i]);
    }
}