using FamilyTree.Application.FamilyTrees.ViewModels;
using MediatR;

namespace FamilyTree.Application.FamilyTrees.Queries
{
    public class GetBloodTreeByIdQuery : IRequest<BloodTreeVm>
    {
        public string UserId { get; set; }

        public int FamilyTreeId { get; set; }

        public int BloodMainId { get; set; }

        public int CurrentMainId { get; set; }

        public int WifeId { get; set; }
    }
}
