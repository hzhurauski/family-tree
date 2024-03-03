using MediatR;
using Microsoft.AspNetCore.Http;

namespace FamilyTree.Application.Media.Videos.Commands
{
    public class CreateVideoCommand : IRequest<int>
    {
        public int DataBlockId { get; set; }

        public IFormFile VideoFile { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string UserId { get; set; }
    }
}
