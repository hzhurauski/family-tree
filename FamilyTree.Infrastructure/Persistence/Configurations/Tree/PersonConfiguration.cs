using FamilyTree.Domain.Entities.Tree;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FamilyTree.Infrastructure.Persistence.Configurations.Tree
{
    public class PersonConfiguration : IEntityTypeConfiguration<Person>
    {
        public void Configure(EntityTypeBuilder<Person> builder)
        {
            builder.HasKey(p => p.Id);
            
            builder.HasOne(p => p.FamilyTree)
                .WithMany(ft => ft.People)
                .HasForeignKey(p => p.FamilyTreeId);

            builder.ToTable("Person");
        }
    }
}
