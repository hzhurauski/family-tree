using FamilyTree.Domain.Common;
using FamilyTree.Domain.Enums.Privacy;
using System;

namespace FamilyTree.Domain.Entities.Privacy
{
    public class PrivacyEntity : AuditableEntity
    {
        public int Id { get; set; }

        public PrivacyLevel PrivacyLevel { get; set; }

        public DateTime BeginDate { get; set; }

        public DateTime EndDate { get; set; }

        public bool? IsAlways { get; set; }
    }
}
