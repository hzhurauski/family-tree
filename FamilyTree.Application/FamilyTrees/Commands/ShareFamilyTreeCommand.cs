using MediatR;

namespace FamilyTree.Application.FamilyTrees.Commands
{
    public class ShareFamilyTreeCommand : IRequest
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public string UserId { get; set; }
    }
}
