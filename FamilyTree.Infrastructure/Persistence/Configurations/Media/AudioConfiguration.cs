using FamilyTree.Domain.Entities.Media;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FamilyTree.Infrastructure.Persistence.Configurations.Media
{
    public class AudioConfiguration : IEntityTypeConfiguration<Audio>
    {
        public void Configure(EntityTypeBuilder<Audio> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.FilePath)
                .HasColumnType("nvarchar(260)")
                .IsRequired();

            builder.Property(a => a.FileType)
                .HasColumnType("nvarchar(10)")
                .IsRequired();

            builder.Property(a => a.Title)
                .HasColumnType("nvarchar(max)")
                .IsRequired();

            builder.Property(a => a.Description)
                .HasColumnType("nvarchar(max)");

            builder.ToTable("Audio");
        }
    }
}
