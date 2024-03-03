using FamilyTree.Domain.Common;
using FamilyTree.Domain.Entities.Privacy;

namespace FamilyTree.Domain.Entities.Media
{
    public class Image : AuditableEntity
    {
        public int Id { get; set; }

        public byte[] ImageData { get; set; }

        public string ImageType { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public int PrivacyId { get; set; }

        public PrivacyEntity Privacy { get; set; }
    }
}