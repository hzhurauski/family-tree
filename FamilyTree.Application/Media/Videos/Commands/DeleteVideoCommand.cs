using MediatR;

namespace FamilyTree.Application.Media.Videos.Commands
{
    public class DeleteVideoCommand : IRequest
    {
        public int Id { get; set; }

        public string UserId { get; set; }
    }
}
