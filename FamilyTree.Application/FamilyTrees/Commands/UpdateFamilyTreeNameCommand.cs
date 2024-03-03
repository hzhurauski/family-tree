using MediatR;

namespace FamilyTree.Application.FamilyTrees.Commands
{
    public class UpdateFamilyTreeNameCommand : IRequest
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string UserId { get; set; }
    }
}
