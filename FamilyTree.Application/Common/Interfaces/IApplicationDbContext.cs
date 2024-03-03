using FamilyTree.Domain.Entities.Media;
using FamilyTree.Domain.Entities.Privacy;
using FamilyTree.Domain.Entities.Tree;
using FamilyTree.Domain.Entities.PersonContent;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using FamilyTree.Domain.Entities.Identity;

namespace FamilyTree.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Profile> Profiles { get; set; }

        DbSet<Person> People { get; set; }

        DbSet<FamilyTie> FamilyTies { get; set; }

        DbSet<FamilyTreeEntity> FamilyTrees { get; set; }

        DbSet<DataCategory> DataCategories { get; set; }

        DbSet<DataBlock> DataBlocks { get; set; }

        DbSet<DataHolder> DataHolders { get; set; }

        DbSet<PrivacyEntity> Privacies { get; set; }

        DbSet<Image> Images { get; set; }

        DbSet<DataBlockImage> DataBlockImages { get; set; }

        DbSet<Video> Videos { get; set; }

        DbSet<DataBlockVideo> DataBlockVideos { get; set; }

        DbSet<Audio> Audios { get; set; }

        DbSet<DataBlockAudio> DataBlockAudios { get; set; }

        DbSet<PersonToDataBlocks> PersonToDataBlocks { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
