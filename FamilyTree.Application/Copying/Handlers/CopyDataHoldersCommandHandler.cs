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
    public class CopyDataHoldersCommandHandler : IRequestHandler<CopyDataHoldersCommand>
    {
        private readonly IApplicationDbContext _context;

        private readonly ICopyingService _copying;

        public CopyDataHoldersCommandHandler(IApplicationDbContext context, ICopyingService copying)
        {
            _context = context;
            _copying = copying;
        }

        public async Task<Unit> Handle(CopyDataHoldersCommand request, CancellationToken cancellationToken)
        {
            DataBlock dataBlock = await _context.DataBlocks
                .Include(db => db.DataHolders)
                .SingleOrDefaultAsync(db => db.CreatedBy.Equals(request.UserId) &&
                                            db.Id == request.DataBlockId,
                                      cancellationToken);

            if (dataBlock == null)
                throw new NotFoundException(nameof(DataBlock), request.DataBlockId);

            var dataHolders = await _context.DataHolders
                .Include(dh => dh.Privacy)
                .Where(dh => dh.CreatedBy.Equals(request.UserId) &&
                             request.DataHoldersIds.Contains(dh.Id))
                .ToListAsync(cancellationToken);

            foreach (var dataHolder in dataHolders)
            {         
                await _copying.CopyDataHolderToDataBlock(dataBlock, dataHolder, cancellationToken);
            }

            return Unit.Value;
        }
    }
}
