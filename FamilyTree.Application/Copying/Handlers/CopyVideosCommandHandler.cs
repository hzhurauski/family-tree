using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FamilyTree.Application.Copying.Interfaces;
using FamilyTree.Application.Copying.Commands;

namespace FamilyTree.Application.Copying.Handlers
{
    public class CopyVideosCommandHandler : IRequestHandler<CopyVideosCommand>
    {
        private readonly IApplicationDbContext _context;

        private readonly ICopyingService _copying;

        public CopyVideosCommandHandler(IApplicationDbContext context, ICopyingService copying)
        {
            _context = context;
            _copying = copying;
        }

        public async Task<Unit> Handle(CopyVideosCommand request, CancellationToken cancellationToken)
        {
            DataBlock dataBlock = await _context.DataBlocks
                .SingleOrDefaultAsync(db => db.CreatedBy.Equals(request.UserId) &&
                                            db.Id == request.DataBlockId,
                                      cancellationToken);

            if (dataBlock == null)
                throw new NotFoundException(nameof(DataBlock), request.DataBlockId);

            var videos = await _context.Videos
                .Include(v => v.Privacy)
                .Where(v => v.CreatedBy.Equals(request.UserId) &&
                            request.VideosIds.Contains(v.Id))
                .ToListAsync(cancellationToken);

            foreach (var video in videos)
            {
                await _copying.CopyVideoToDataBlock(dataBlock, video, cancellationToken);
            }

            return Unit.Value;
        }
    }
}
