using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataHolders.Commands;
using FamilyTree.Application.PersonContent.DataHolders.Extensions;
using FamilyTree.Domain.Entities.PersonContent;
using FamilyTree.Domain.Entities.Privacy;
using FamilyTree.Domain.Enums.Privacy;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataHolders.Handlers
{
    public class CreateDataHolderCommandHandler : IRequestHandler<CreateDataHolderCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateDataHolderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateDataHolderCommand request, CancellationToken cancellationToken)
        {
            DataBlock dataBlock = await _context.DataBlocks
                .Include(db => db.DataHolders)
                .SingleOrDefaultAsync(db => db.CreatedBy.Equals(request.UserId) &&
                                            db.Id == request.DataBlockId,
                                      cancellationToken);

            if (dataBlock == null)
                throw new NotFoundException(nameof(DataBlock), request.DataBlockId);

            if (!request.CanCreate())
                throw new ArgumentException(
                    $"DataHolder with DataHolderType = \"{request.DataHolderType}\" is not allowed to create.", 
                    nameof(request.DataHolderType));

            DataHolder entity = new DataHolder() 
            {
                Data = string.Empty,
                Title = request.Title,
                DataHolderType = request.DataHolderType,
                DataBlockId = dataBlock.Id,
                OrderNumber = dataBlock.DataHolders.Count() + 1,
                Privacy = new PrivacyEntity()
                {
                    IsAlways = true,
                    PrivacyLevel = PrivacyLevel.Confidential
                }
            };

            _context.DataHolders.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
