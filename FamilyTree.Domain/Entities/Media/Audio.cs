using FamilyTree.Domain.Common;
using FamilyTree.Domain.Entities.Privacy;

namespace FamilyTree.Domain.Entities.Media
{
    public class Audio : AuditableEntity
    {
        public int Id { get; set; }

        public string FilePath { get; set; }

        public string FileType { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public int PrivacyId { get; set; }

        public PrivacyEntity Privacy { get; set; }
    }
}
