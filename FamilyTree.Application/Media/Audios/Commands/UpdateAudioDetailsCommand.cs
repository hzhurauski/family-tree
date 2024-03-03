using MediatR;

namespace FamilyTree.Application.Media.Audios.Commands
{
    public class UpdateAudioDetailsCommand : IRequest
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string UserId { get; set; }
    }
}
