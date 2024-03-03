using FamilyTree.Application.Media.Videos.ViewModels;
using MediatR;

namespace FamilyTree.Application.Media.Videos.Queries
{
    public class GetVideoQuery : IRequest<VideoVm>
    {
        public int Id { get; set; }

        public string UserId { get; set; }
    }
}
