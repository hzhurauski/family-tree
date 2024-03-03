using MediatR;

namespace FamilyTree.Application.People.Queries
{
    public class GetRelationsByPeopleIdsQuery : IRequest<string>
    {
        public string UserId { get; set; }

        public int? FamilyTreeId { get; set; }

        public int? TargetPersonId { get; set; }

        public int? PersonId { get; set; }
    }
}
