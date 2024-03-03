using FamilyTree.Domain.Common;

namespace FamilyTree.Domain.Entities.Tree
{
    public class SharedTree : AuditableEntity
    {
        public int Id { get; set; }

        public int FamilyTreeId { get; set; }

        public string OwnerId { get; set; }

        public string SharedPersonId { get; set; }
    }
}
