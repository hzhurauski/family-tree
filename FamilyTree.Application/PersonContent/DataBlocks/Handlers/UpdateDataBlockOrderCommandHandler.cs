using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataBlocks.Commands;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataBlocks.Handlers
{
    public class UpdateDataBlockOrderCommandHandler : IRequestHandler<UpdateDataBlockOrderCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDataBlockOrderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateDataBlockOrderCommand request, CancellationToken cancellationToken)
        {
            var dataBlock = await _context.DataBlocks
                .SingleOrDefaultAsync(dh => dh.CreatedBy.Equals(request.UserId) &&
                                            dh.Id == request.Id,
                                      cancellationToken);

            if (dataBlock == null)
                throw new NotFoundException(nameof(DataCategory), request.Id);

            if (dataBlock.OrderNumber == request.Order)
                return Unit.Value;

            var dataBlocks = await _context.DataBlocks
                .Where(db => db.DataCategoryId == dataBlock.DataCategoryId)
                .OrderBy(dh => dh.OrderNumber)
                .ToListAsync(cancellationToken);

            if (request.Order > dataBlocks.Count)
                request.Order = dataBlocks.Count;

            if (dataBlock.OrderNumber < request.Order)
            {
                for (int i = dataBlock.OrderNumber + 1; i <= request.Order; i++)
                {
                    dataBlocks[i - 1].OrderNumber = i - 1;
                }
            }
            else
            {
                for (int i = request.Order; i < dataBlock.OrderNumber; i++)
                {
                    dataBlocks[i - 1].OrderNumber = i + 1;
                }
            }

            dataBlock.OrderNumber = request.Order;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
