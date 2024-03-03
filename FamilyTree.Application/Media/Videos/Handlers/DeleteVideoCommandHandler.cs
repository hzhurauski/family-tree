using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Videos.Commands;
using FamilyTree.Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Media.Videos.Handlers
{
    public class DeleteVideoCommandHandler : IRequestHandler<DeleteVideoCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteVideoCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteVideoCommand request, CancellationToken cancellationToken)
        {
            Video video = await _context.Videos
                .SingleOrDefaultAsync(v => v.CreatedBy.Equals(request.UserId) &&
                                           v.Id == request.Id,
                                      cancellationToken);

            if (video == null)
                throw new NotFoundException(nameof(Video), request.Id);

            int videoLinksCount = await _context.Videos
                .CountAsync(v => v.FilePath.Equals(video.FilePath), 
                            cancellationToken);

            if (videoLinksCount == 1 && File.Exists(video.FilePath))
                File.Delete(video.FilePath);

            _context.Videos.Remove(video);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
