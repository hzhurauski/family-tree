using MediatR;

namespace FamilyTree.Application.FamilyTrees.Commands
{
    public class CreateFamilyTreeCommand : IRequest<int>
    {
        public string Name { get; set; }

        public string UserId { get; set; }
    }
}
