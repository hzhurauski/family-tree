using FamilyTree.Domain.Enums.Privacy;
using MediatR;
using System;

namespace FamilyTree.Application.Privacy.Commands
{
    public class UpdatePrivacyCommand : IRequest 
    {
        public int Id { get; set; }

        public PrivacyLevel? PrivacyLevel { get; set; }

        public DateTime? BeginDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool? IsAlways { get; set; }

        public string UserId { get; set; }
    }
}
