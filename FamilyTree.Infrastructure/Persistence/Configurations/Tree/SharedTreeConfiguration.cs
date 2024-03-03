using FamilyTree.Domain.Entities.Tree;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FamilyTree.Infrastructure.Persistence.Configurations.Tree
{
    public class SharedTreeConfiguration : IEntityTypeConfiguration<SharedTree>
    {
        public void Configure(EntityTypeBuilder<SharedTree> builder)
        {
            builder.HasKey(st => st.Id);

            builder.Property(st => st.OwnerId)
                .HasColumnType("nvarchar(450)")
                .IsRequired();

            builder.Property(st => st.SharedPersonId)
                .HasColumnType("nvarchar(450)")
                .IsRequired();

            builder.Property(st => st.FamilyTreeId)
                .HasColumnType("int")
                .IsRequired();

            builder.ToTable("SharedTree");
        }
    }
}
