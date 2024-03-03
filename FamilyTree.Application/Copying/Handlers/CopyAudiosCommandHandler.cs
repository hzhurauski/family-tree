using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Copying.Commands;
using FamilyTree.Application.Copying.Interfaces;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Copying.Handlers
{
    public class CopyAudiosCommandHandler : IRequestHandler<CopyAudiosCommand>
    {
        private readonly IApplicationDbContext _context;

        private readonly ICopyingService _copying;

        public CopyAudiosCommandHandler(IApplicationDbContext context, ICopyingService copying)
        {
            _context = context;
            _copying = copying;
        }

        public async Task<Unit> Handle(CopyAudiosCommand request, CancellationToken cancellationToken)
        {
            DataBlock dataBlock = await _context.DataBlocks
                .SingleOrDefaultAsync(db => db.CreatedBy.Equals(request.UserId) &&
                                            db.Id == request.DataBlockId,
                                      cancellationToken);

            if (dataBlock == null)
                throw new NotFoundException(nameof(DataBlock), request.DataBlockId);

            var audios = await _context.Audios
                .Include(a => a.Privacy)
                .Where(a => a.CreatedBy.Equals(request.UserId) &&
                            request.AudiosIds.Contains(a.Id))
                .ToListAsync(cancellationToken);

            foreach (var audio in audios)
            {
                await _copying.CopyAudioToDataBlock(dataBlock, audio, cancellationToken);
            }

            return Unit.Value;
        }
    }
}
