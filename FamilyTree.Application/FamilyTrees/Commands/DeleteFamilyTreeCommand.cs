using MediatR;

namespace FamilyTree.Application.FamilyTrees.Commands
{
    public class DeleteFamilyTreeCommand : IRequest
    {
        public int Id { get; set; }

        public string UserId { get; set; }
    }
}
