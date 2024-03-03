using FamilyTree.Application.FamilyTrees.Interfaces;
using FamilyTree.Application.FamilyTrees.Queries;
using FamilyTree.Application.FamilyTrees.ViewModels;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.FamilyTrees.Handlers
{
    public class GetBloodTreeQueryHandler : IRequestHandler<GetBloodTreeByIdQuery, BloodTreeVm>
    {
        private readonly IFamilyTreeService _service;

        public GetBloodTreeQueryHandler(IFamilyTreeService service)
        {
            _service = service;
        }

        public async Task<BloodTreeVm> Handle(GetBloodTreeByIdQuery request, CancellationToken cancellationToken)
        {
            return await _service.GetBloodTreeById(request, cancellationToken);
        }
    }
}
