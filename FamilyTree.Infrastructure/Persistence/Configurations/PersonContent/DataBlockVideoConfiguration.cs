using FamilyTree.Domain.Entities.PersonContent;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FamilyTree.Infrastructure.Persistence.Configurations.PersonContent
{
    public class DataBlockVideoConfiguration : IEntityTypeConfiguration<DataBlockVideo>
    {
        public void Configure(EntityTypeBuilder<DataBlockVideo> builder)
        {
            builder.HasKey(dbv => dbv.Id);

            builder.ToTable("DataBlockVideo");
        }
    }
}
