using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Copying.Commands;
using FamilyTree.Application.Copying.Interfaces;
using FamilyTree.Domain.Entities.PersonContent;
using FamilyTree.Domain.Enums.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Copying.Handlers
{
    public class CopyDataBlocksCommandHandler : IRequestHandler<CopyDataBlocksCommand>
    {
        private readonly IApplicationDbContext _context;

        private readonly ICopyingService _copying;

        public CopyDataBlocksCommandHandler(IApplicationDbContext context, ICopyingService copying)
        {
            _context = context;
            _copying = copying;
        }

        public async Task<Unit> Handle(CopyDataBlocksCommand request, CancellationToken cancellationToken)
        {
            DataCategory dataCategory = await _context.DataCategories
                .Include(dc => dc.DataBlocks)
                .SingleOrDefaultAsync(dc => dc.CreatedBy.Equals(request.UserId) &&
                                            dc.Id == request.DataCategoryId,
                                      cancellationToken);

            if (dataCategory == null)
                throw new NotFoundException(nameof(DataCategory), request.DataCategoryId);

            if (dataCategory.DataCategoryType == DataCategoryType.InfoBlock ||
                dataCategory.DataCategoryType == DataCategoryType.PersonInfo)
                throw new Exception($"Can not copy to DataCategory with CategoryType = \"{dataCategory.DataCategoryType}\"");

            var dataBlocks = await _context.DataBlocks
                .Include(db => db.DataHolders)
                .ThenInclude(dh => dh.Privacy)
                .Where(db => db.CreatedBy.Equals(request.UserId) &&
                             request.DataBlocksIds.Contains(db.Id))
                .ToListAsync(cancellationToken);

            foreach (var dataBlock in dataBlocks)
            {            
                await _copying.CopyDataBlockToDataCategory(dataCategory, dataBlock, cancellationToken);
            }

            return Unit.Value;
        }
    }
}
