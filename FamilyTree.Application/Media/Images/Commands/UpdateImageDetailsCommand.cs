using MediatR;

namespace FamilyTree.Application.Media.Images.Commands
{
    public class UpdateImageDetailsCommand : IRequest
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string UserId { get; set; }
    }
}
