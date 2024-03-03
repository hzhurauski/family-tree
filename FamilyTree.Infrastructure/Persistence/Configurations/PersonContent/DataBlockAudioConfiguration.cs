using FamilyTree.Domain.Entities.PersonContent;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FamilyTree.Infrastructure.Persistence.Configurations.PersonContent
{
    class DataBlockAudioConfiguration : IEntityTypeConfiguration<DataBlockAudio>
    {
        public void Configure(EntityTypeBuilder<DataBlockAudio> builder)
        {
            builder.HasKey(dbv => dbv.Id);

            builder.ToTable("DataBlockAudio");
        }
    }
}
