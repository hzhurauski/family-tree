using MediatR;
using Microsoft.AspNetCore.Http;

namespace FamilyTree.Application.Media.Audios.Commands
{
    public class CreateAudioCommand : IRequest<int>
    {
        public int DataBlockId { get; set; }

        public IFormFile AudioFile { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string UserId { get; set; }
    }
}
