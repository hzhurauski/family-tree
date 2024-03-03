using FamilyTree.Application.PersonContent.DataBlocks.ViewModels;
using FamilyTree.Domain.Entities.Media;
using FamilyTree.Domain.Entities.PersonContent;
using FamilyTree.Domain.Entities.Tree;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Copying.Interfaces
{
    public interface ICopyingService
    {
        Task<List<DataBlockDto>> CopyDataCategoryToPerson(Person person, DataCategory dataCategory, CancellationToken cancellationToken);

        Task<DataBlockDto> CopyDataBlockToDataCategory(DataCategory dataCategory, DataBlock dataBlock, CancellationToken cancellationToken);

        Task CopyDataHolderToDataBlock(DataBlock dataBlock, DataHolder dataHolder, CancellationToken cancellationToken);

        Task CopyImageToDataBlock(DataBlock dataBlock, Image image, CancellationToken cancellationToken);

        Task CopyVideoToDataBlock(DataBlock dataBlock, Video video, CancellationToken cancellationToken);

        Task CopyAudioToDataBlock(DataBlock dataBlock, Audio audio, CancellationToken cancellationToken);
    }
}
