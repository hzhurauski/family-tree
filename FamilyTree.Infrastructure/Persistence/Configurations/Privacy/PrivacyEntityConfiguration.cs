using FamilyTree.Domain.Entities.Privacy;
using FamilyTree.Domain.Enums.Privacy;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FamilyTree.Infrastructure.Persistence.Configurations.Privacy
{
    public class PrivacyEntityConfiguration : IEntityTypeConfiguration<PrivacyEntity>
    {
        public void Configure(EntityTypeBuilder<PrivacyEntity> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.PrivacyLevel)
                .HasDefaultValue(PrivacyLevel.Confidential)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(p => p.BeginDate)
                .HasColumnType("datetime2");

            builder.Property(p => p.EndDate)
                .HasColumnType("datetime2");

            builder.Property(p => p.IsAlways)
                .HasColumnType("bit")
                .HasDefaultValueSql("1")
                .IsRequired();

            builder.ToTable("Privacy");
        }
    }
}
