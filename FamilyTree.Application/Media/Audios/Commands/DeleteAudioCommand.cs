using MediatR;

namespace FamilyTree.Application.Media.Audios.Commands
{
    public class DeleteAudioCommand : IRequest
    {
        public int Id { get; set; }

        public string UserId { get; set; }
    }
}
