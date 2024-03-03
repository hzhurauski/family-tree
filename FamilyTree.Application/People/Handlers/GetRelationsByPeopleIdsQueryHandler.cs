using FamilyTree.Application.FamilyTrees.Interfaces;
using FamilyTree.Application.People.Queries;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.People.Handlers
{
    public class GetRelationsByPeopleIdsQueryHandler : IRequestHandler<GetRelationsByPeopleIdsQuery, string>
    {
        private readonly IFamilyTreeService _service;

        public GetRelationsByPeopleIdsQueryHandler(IFamilyTreeService service)
        {
            _service = service;
        }

        public async Task<string> Handle(GetRelationsByPeopleIdsQuery request, CancellationToken cancellationToken)
        {
            return await _service.GetRelationsByPeopleIds(request, cancellationToken);
        }
    }
}
