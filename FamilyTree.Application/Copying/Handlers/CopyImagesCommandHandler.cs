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
    public class CopyImagesCommandHandler : IRequestHandler<CopyImagesCommand>
    {
        private readonly IApplicationDbContext _context;

        private readonly ICopyingService _copying;

        public CopyImagesCommandHandler(IApplicationDbContext context, ICopyingService copying)
        {
            _context = context;
            _copying = copying;
        }

        public async Task<Unit> Handle(CopyImagesCommand request, CancellationToken cancellationToken)
        {
            DataBlock dataBlock = await _context.DataBlocks
                .SingleOrDefaultAsync(db => db.CreatedBy.Equals(request.UserId) &&
                                            db.Id == request.DataBlockId,
                                      cancellationToken);

            if (dataBlock == null)
                throw new NotFoundException(nameof(DataBlock), request.DataBlockId);

            var images = await _context.Images
                .Include(i => i.Privacy)
                .Where(i => i.CreatedBy.Equals(request.UserId) && 
                            request.ImagesIds.Contains(i.Id))
                .ToListAsync(cancellationToken);

            foreach (var image in images)
            {
                await _copying.CopyImageToDataBlock(dataBlock, image, cancellationToken);
            }

            return Unit.Value;
        }
    }
}
