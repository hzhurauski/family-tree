using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Domain.Common;
using FamilyTree.Domain.Entities.Media;
using FamilyTree.Domain.Entities.Privacy;
using FamilyTree.Domain.Entities.Tree;
using FamilyTree.Domain.Entities.PersonContent;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using FamilyTree.Domain.Entities.Identity;

namespace FamilyTree.Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
    {
        private readonly ICurrentUserService _currentUserService;

        private readonly IDateTimeService _dateTimeService;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options,
                                    ICurrentUserService currentUserService,
                                    IDateTimeService dateTimeService) : base(options)
        {
            _currentUserService = currentUserService;
            _dateTimeService = dateTimeService;
        }

        public DbSet<Profile> Profiles { get; set; }

        public DbSet<Person> People { get; set; }

        public DbSet<FamilyTie> FamilyTies { get; set; }

        public DbSet<FamilyTreeEntity> FamilyTrees { get; set; }

        public DbSet<DataCategory> DataCategories { get; set; }

        public DbSet<DataBlock> DataBlocks { get; set; }

        public DbSet<DataHolder> DataHolders { get; set; }

        public DbSet<PrivacyEntity> Privacies { get; set; }

        public DbSet<Image> Images { get; set; }

        public DbSet<DataBlockImage> DataBlockImages { get; set; }

        public DbSet<Video> Videos { get; set; }

        public DbSet<DataBlockVideo> DataBlockVideos { get; set; }

        public DbSet<Audio> Audios { get; set; }

        public DbSet<DataBlockAudio> DataBlockAudios { get; set; }

        public DbSet<PersonToDataBlocks> PersonToDataBlocks { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            foreach (EntityEntry<AuditableEntity> entry in ChangeTracker.Entries<AuditableEntity>())
            {
                switch(entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedBy = _currentUserService.UserId;
                        entry.Entity.Created = _dateTimeService.Now;
                        break;

                    case EntityState.Modified:
                        entry.Entity.LastModifiedBy = _currentUserService.UserId;
                        entry.Entity.LastModified = _dateTimeService.Now;
                        break;

                    default:
                        break;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            base.OnModelCreating(builder);
        }
    }
}
