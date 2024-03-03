using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataHolders.Commands;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataHolders.Handlers
{
    public class UpdateDataHolderOrderCommandHandler : IRequestHandler<UpdateDataHolderOrderCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDataHolderOrderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateDataHolderOrderCommand request, CancellationToken cancellationToken)
        {
            var dataHolder = await _context.DataHolders
                .SingleOrDefaultAsync(dh => dh.CreatedBy.Equals(request.UserId) &&
                                            dh.Id == request.Id,
                                      cancellationToken);

            if (dataHolder == null)
                throw new NotFoundException(nameof(DataHolder), request.Id);

            if (dataHolder.OrderNumber == request.Order)
                return Unit.Value;

            var dataHolders = await _context.DataHolders
                .Where(dh => dh.DataBlockId == dataHolder.DataBlockId)
                .OrderBy(dh => dh.OrderNumber)
                .ToListAsync(cancellationToken);

            if (request.Order > dataHolders.Count)
                request.Order = dataHolders.Count;

            if (dataHolder.OrderNumber < request.Order)
            {
                for (int i = dataHolder.OrderNumber + 1; i <= request.Order; i++)
                {
                    dataHolders[i - 1].OrderNumber = i - 1;
                }
            } 
            else
            {
                for (int i = request.Order; i < dataHolder.OrderNumber; i++)
                {
                    dataHolders[i - 1].OrderNumber = i + 1;
                }
            }

            dataHolder.OrderNumber = request.Order;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}