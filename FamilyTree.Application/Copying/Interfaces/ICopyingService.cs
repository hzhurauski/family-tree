using FamilyTree.Domain.Entities.Media;
using FamilyTree.Domain.Entities.PersonContent;
using FamilyTree.Domain.Entities.Tree;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Copying.Interfaces
{
    public interface ICopyingService
    {
        Task CopyDataCategoryToPerson(Person person, DataCategory dataCategory, CancellationToken cancellationToken);

        Task CopyDataBlockToDataCategory(DataCategory dataCategory, DataBlock dataBlock, CancellationToken cancellationToken);

        Task CopyDataHolderToDataBlock(DataBlock dataBlock, DataHolder dataHolder, CancellationToken cancellationToken);

        Task CopyImageToDataBlock(DataBlock dataBlock, Image image, CancellationToken cancellationToken);

        Task CopyVideoToDataBlock(DataBlock dataBlock, Video video, CancellationToken cancellationToken);

        Task CopyAudioToDataBlock(DataBlock dataBlock, Audio audio, CancellationToken cancellationToken);
    }
}
