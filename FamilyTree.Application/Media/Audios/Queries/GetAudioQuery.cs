using FamilyTree.Application.Media.Audios.ViewModels;
using MediatR;

namespace FamilyTree.Application.Media.Audios.Queries
{
    public class GetAudioQuery : IRequest<AudioVm>
    {
        public int Id { get; set; }

        public string UserId { get; set; }
    }
}
