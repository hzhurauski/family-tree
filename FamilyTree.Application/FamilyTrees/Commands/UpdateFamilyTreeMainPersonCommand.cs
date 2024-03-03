using MediatR;

namespace FamilyTree.Application.FamilyTrees.Commands
{
    public class UpdateFamilyTreeMainPersonCommand : IRequest
    {
        public int Id { get; set; }

        public int PersonId { get; set; }

        public string UserId { get; set; }
    }
}
