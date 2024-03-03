using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Videos.Queries;
using FamilyTree.Application.Media.Videos.ViewModels;
using FamilyTree.Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Media.Videos.Handlers
{
    public class GetVideoQueryHandler : IRequestHandler<GetVideoQuery, VideoVm>
    {
        private readonly IApplicationDbContext _context;

        public GetVideoQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<VideoVm> Handle(GetVideoQuery request, CancellationToken cancellationToken)
        {
            Video video = await _context.Videos
                .SingleOrDefaultAsync(v => v.CreatedBy.Equals(request.UserId) &&
                                           v.Id == request.Id,
                                      cancellationToken);

            if (video == null)
                throw new NotFoundException(nameof(Video), request.Id);

            VideoVm result = new VideoVm();
            result.FileStream = new FileStream(video.FilePath, FileMode.Open, FileAccess.Read);
            result.FileType = video.FileType;

            return result;
        }
    }
}
