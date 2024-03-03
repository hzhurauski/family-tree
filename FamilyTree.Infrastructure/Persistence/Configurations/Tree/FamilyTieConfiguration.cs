using Microsoft.EntityFrameworkCore;
using FamilyTree.Domain.Entities.Tree;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FamilyTree.Infrastructure.Persistence.Configurations.Tree
{
    public class FamilyTieConfiguration : IEntityTypeConfiguration<FamilyTie>
    {
        public void Configure(EntityTypeBuilder<FamilyTie> builder)
        {
            builder.HasKey(ft => ft.Id);

            builder.ToTable("FamilyTie");
        }
    }
}
