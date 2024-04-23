import { RefreshDataCategories } from "./RefreshDataCategories.js";
import { UpdateDataCategories } from "./UpdateDataCategories.js";
import { UpdateDataCategoryName } from "./UpdateDataCategoryName.js";

export function OnEditDataCategorySubmitButtonClick() {
    let dataCategory = {
        Id: window.g_editElementId,
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