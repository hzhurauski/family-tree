import { GetSelectedImagesIds } from "./GetSelectedImagesIds.js";

export async function DeleteSelectedImages() {
    let imagesIds = GetSelectedImagesIds();

    if (imagesIds.length == 0)
        return;

    const promises = imagesIds.map(window.DeleteImage);

    await Promise.all(promises);
}