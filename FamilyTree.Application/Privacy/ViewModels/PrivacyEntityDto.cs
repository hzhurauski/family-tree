using FamilyTree.Domain.Enums.Privacy;
using System;

namespace FamilyTree.Application.Privacy.ViewModels
{
    public class PrivacyEntityDto
    {
        public int Id { get; set; }

        public PrivacyLevel PrivacyLevel { get; set; }

        public DateTime BeginDate { get; set; }

        public DateTime EndDate { get; set; }

        public bool IsAlways { get; set; }
    }
}
