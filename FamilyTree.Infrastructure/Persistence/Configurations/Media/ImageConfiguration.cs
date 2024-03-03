using FamilyTree.Domain.Entities.Media;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FamilyTree.Infrastructure.Persistence.Configurations.Media
{
    public class ImageConfiguration : IEntityTypeConfiguration<Image>
    {
        public void Configure(EntityTypeBuilder<Image> builder)
        {
            builder.HasKey(i => i.Id);

            builder.Property(i => i.ImageData)
                .HasColumnType("image")
                .IsRequired();

            builder.Property(i => i.ImageType)
                .HasColumnType("nvarchar(10)")
                .IsRequired();

            builder.Property(i => i.Title)
                .HasColumnType("nvarchar(max)")
                .IsRequired();

            builder.Property(i => i.Description)
                .HasColumnType("nvarchar(max)");

            builder.ToTable("Image");
        }
    }
}
