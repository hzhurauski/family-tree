using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Copying.Commands;
using FamilyTree.Application.Copying.Interfaces;
using FamilyTree.Application.PersonContent.DataBlocks.ViewModels;
using FamilyTree.Domain.Entities.PersonContent;
using FamilyTree.Domain.Enums.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Copying.Handlers
{
    public class CopyDataBlocksCommandHandler : IRequestHandler<CopyDataBlocksCommand, List<DataBlockDto>>
    {
        private readonly IApplicationDbContext _context;

        private readonly ICopyingService _copying;

        public CopyDataBlocksCommandHandler(IApplicationDbContext context, ICopyingService copying)
        {
            _context = context;
            _copying = copying;
        }

        public async Task<List<DataBlockDto>> Handle(CopyDataBlocksCommand request, CancellationToken cancellationToken)
        { // придётся отдавать модель датаБлок-датаХолдеры, чтобы обновить айди датахолдеров на фронте и потом сохранить
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

            var createdDataBlockIds = new List<DataBlockDto>();

            foreach (var dataBlock in dataBlocks)
            {            
                createdDataBlockIds.Add(await _copying.CopyDataBlockToDataCategory(dataCategory, dataBlock, cancellationToken));
            }

            return createdDataBlockIds;
        }
    }
}
