import { GetDataCategory } from "./GetDataCategory.js";

export function RefreshDataCategory() {
    g_currentDataCategory = GetDataCategory(g_currentDataCategory.Id);
}
