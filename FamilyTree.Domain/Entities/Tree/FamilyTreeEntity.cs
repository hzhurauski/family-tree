using FamilyTree.Domain.Common;
using FamilyTree.Domain.Entities.Identity;
using System.Collections.Generic;

namespace FamilyTree.Domain.Entities.Tree
{
    public class FamilyTreeEntity : AuditableEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int? MainPersonId { get; set; }

        public Person MainPerson { get; set; }

        public string UserId { get; set; }

        public ApplicationUser User { get; set; }

        public ICollection<Person> People { get; set; }
    }
}
