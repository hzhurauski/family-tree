using FamilyTree.Application.FamilyTrees.Interfaces;
using FamilyTree.Application.FamilyTrees.Queries;
using FamilyTree.Application.FamilyTrees.ViewModels;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.FamilyTrees.Handlers
{
    public class GetFamilyTreeQueryHandler : IRequestHandler<GetFamilyTreeByIdQuery, FamilyTreeVm>
    {
        private readonly IFamilyTreeService _service;

        public GetFamilyTreeQueryHandler(IFamilyTreeService service)
        {
            _service = service;
        }

        public async Task<FamilyTreeVm> Handle(GetFamilyTreeByIdQuery request, CancellationToken cancellationToken)
        {
            return await _service.GetFamilyTreeById(request, cancellationToken);
        }
    }
}