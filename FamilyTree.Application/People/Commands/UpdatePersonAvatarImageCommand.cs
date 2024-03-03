using MediatR;

namespace FamilyTree.Application.People.Commands
{
    public class UpdatePersonAvatarImageCommand : IRequest
    {
        public int Id { get; set; }

        public int ImageId { get; set; }

        public string UserId { get; set; }
    }
}
