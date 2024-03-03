using FamilyTree.Domain.Common;

namespace FamilyTree.Domain.Entities.Tree
{
    public class FamilyTie : AuditableEntity
    {
        public int Id { get; set; }

        public int PersonId { get; set; }

        public Person Person { get; set; }

        public int? Parent1Id { get; set; }

        public Person Parent1 { get; set; }

        public int? Parent2Id { get; set; }

        public Person Parent2 { get; set; }

        public int? ChildId { get; set; }

        public Person Child { get; set; }

        public int? MarriagePersonId { get; set; }

        public Person MarriagePerson { get; set; }
    }
}
