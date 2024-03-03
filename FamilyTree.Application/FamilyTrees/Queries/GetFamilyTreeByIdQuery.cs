using FamilyTree.Application.FamilyTrees.ViewModels;
using MediatR;

namespace FamilyTree.Application.FamilyTrees.Queries
{
    public class GetFamilyTreeByIdQuery : IRequest<FamilyTreeVm>
    {
        public string UserId { get; set; }

        public int FamilyTreeId { get; set; }

        public int PersonId { get; set; }

        public int WifeId { get; set; }
    }
}
