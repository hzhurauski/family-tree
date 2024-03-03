using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataCategories.Commands;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataCategories.Handlers
{
    public class UpdateDataCategoryOrderCommandHandler : IRequestHandler<UpdateDataCategoryOrderCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDataCategoryOrderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateDataCategoryOrderCommand request, CancellationToken cancellationToken)
        {
            var dataCategory = await _context.DataCategories
                .SingleOrDefaultAsync(dh => dh.CreatedBy.Equals(request.UserId) &&
                                            dh.Id == request.Id,
                                      cancellationToken);

            if (dataCategory == null)
                throw new NotFoundException(nameof(DataCategory), request.Id);

            if (dataCategory.OrderNumber == request.Order)
                return Unit.Value;

            var dataCategories = await _context.DataCategories
                .Where(dc => dc.PersonId == dataCategory.PersonId)
                .OrderBy(dh => dh.OrderNumber)
                .ToListAsync(cancellationToken);

            if (request.Order > dataCategories.Count)
                request.Order = dataCategories.Count;

            if (dataCategory.OrderNumber < request.Order)
            {
                for (int i = dataCategory.OrderNumber + 1; i <= request.Order; i++)
                {
                    dataCategories[i - 1].OrderNumber = i - 1;
                }
            }
            else
            {
                for (int i = request.Order; i < dataCategory.OrderNumber; i++)
                {
                    dataCategories[i - 1].OrderNumber = i + 1;
                }
            }

            dataCategory.OrderNumber = request.Order;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
