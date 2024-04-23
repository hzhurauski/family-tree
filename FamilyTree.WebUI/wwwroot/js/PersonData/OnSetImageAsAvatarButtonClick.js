import { ReloadTree } from "../LoadTree/LoadTree.js";
import { GetImageSliderCurrentImageId } from "./GetImageSliderCurrentImageId.js";
import { GetPersonData } from "./GetPersonData.js";
import { UpdatePersonAvatarImage } from "./UpdatePersonAvatarImage.js";
import { UpdateSliderImageDetails } from "./UpdateSliderImageDetails.js";

export function OnSetImageAsAvatarButtonClick() {
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