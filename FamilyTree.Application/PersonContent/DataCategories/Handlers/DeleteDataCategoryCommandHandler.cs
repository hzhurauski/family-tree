using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataCategories.Commands;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataCategories.Handlers
{
    public class DeleteDataCategoryCommandHandler : IRequestHandler<DeleteDataCategoryCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteDataCategoryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteDataCategoryCommand request, CancellationToken cancellationToken)
        {
            DataCategory dataCategory = await _context.DataCategories
                .SingleOrDefaultAsync(dh => dh.CreatedBy.Equals(request.UserId) &&
                                            dh.Id == request.Id,
                                      cancellationToken);

            if (dataCategory == null)
                throw new NotFoundException(nameof(DataHolder), request.Id);

            if (!dataCategory.IsDeletable.Value)
                throw new Exception("Can\'t delete DataHolder. This DataHolder isn\'t deletable");

            var dataCategories = await _context.DataCategories
                .Where(dc => dc.PersonId == dataCategory.PersonId)
                .OrderBy(dc => dc.OrderNumber)
                .ToListAsync(cancellationToken);

            for (int i = dataCategory.OrderNumber; i < dataCategories.Count; i++)
            {
                dataCategories[i].OrderNumber = i;
            }

            _context.DataCategories.Remove(dataCategory);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
