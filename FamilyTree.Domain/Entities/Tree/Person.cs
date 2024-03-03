using FamilyTree.Domain.Common;
using FamilyTree.Domain.Entities.Media;
using FamilyTree.Domain.Entities.PersonContent;
using System.Collections.Generic;

namespace FamilyTree.Domain.Entities.Tree
{
    public class Person : AuditableEntity
    {
        public int Id { get; set; }

        public int FamilyTreeId { get; set; }

        public FamilyTreeEntity FamilyTree { get; set; }

        public int? AvatarImageId { get; set; }

        public Image AvatarImage { get; set; }

        public ICollection<DataCategory> DataCategories { get; set; }
    }
}
