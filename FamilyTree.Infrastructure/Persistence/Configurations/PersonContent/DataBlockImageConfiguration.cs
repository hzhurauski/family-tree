using FamilyTree.Domain.Entities.PersonContent;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FamilyTree.Infrastructure.Persistence.Configurations.PersonContent
{
    public class DataBlockImageConfiguration : IEntityTypeConfiguration<DataBlockImage>
    {
        public void Configure(EntityTypeBuilder<DataBlockImage> builder)
        {
            builder.HasKey(dbi => dbi.Id);

            builder.ToTable("DataBlockImage");
        }
    }
}
