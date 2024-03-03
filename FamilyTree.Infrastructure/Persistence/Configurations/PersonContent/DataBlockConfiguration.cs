using FamilyTree.Domain.Entities.PersonContent;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FamilyTree.Infrastructure.Persistence.Configurations.PersonContent
{
    public class DataBlockConfiguration : IEntityTypeConfiguration<DataBlock>
    {
        public void Configure(EntityTypeBuilder<DataBlock> builder)
        {
            builder.HasKey(db => db.Id);

            builder.Property(db => db.Title)
                .HasColumnType("nvarchar(max)")
                .IsRequired();

            builder.ToTable("DataBlock");
        }
    }
}
