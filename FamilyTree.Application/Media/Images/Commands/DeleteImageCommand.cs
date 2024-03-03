using MediatR;

namespace FamilyTree.Application.Media.Images.Commands
{
    public class DeleteImageCommand : IRequest
    {
        public int Id { get; set; }

        public string UserId { get; set; }
    }
}
