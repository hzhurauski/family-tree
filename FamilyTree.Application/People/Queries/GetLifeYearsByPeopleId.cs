using System;
using System.Collections.Generic;
using System.Text;
using MediatR;

namespace FamilyTree.Application.People.Queries
{
    public class GetLifeYearsByPeopleIdQuery : IRequest<string>
    {
        public string UserId { get; set; }

        public int? FamilyTreeId { get; set; }

        //public int? TargetPersonId { get; set; }

        public int? PersonId { get; set; }
    }
}
