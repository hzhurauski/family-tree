import { DeleteDataBlock } from "./DeleteDataBlock.js";
import { GetSelectedDataBlocksIds } from "./GetSelectedDataBlocksIds.js";

export async function DeleteSelectedDataBlocks() {
    let dataBlocksIds = GetSelectedDataBlocksIds();

    if (dataBlocksIds.length == 0)
        return;

    for (let i = 0; i < dataBlocksIds.length; i++) {
        await DeleteDataBlock(dataBlocksIds[i]);
    }
}