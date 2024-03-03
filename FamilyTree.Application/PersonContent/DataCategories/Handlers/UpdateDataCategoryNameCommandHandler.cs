using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataCategories.Commands;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataCategories.Handlers
{
    public class UpdateDataCategoryNameCommandHandler : IRequestHandler<UpdateDataCategoryNameCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDataCategoryNameCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateDataCategoryNameCommand request, CancellationToken cancellationToken)
        {
            DataCategory dataCategory = await _context.DataCategories
                .SingleOrDefaultAsync(db => db.CreatedBy.Equals(request.UserId) &&
                                            db.Id == request.Id,
                                      cancellationToken);

            if (dataCategory == null)
                throw new NotFoundException(nameof(DataCategory), request.Id);

            if (!dataCategory.IsDeletable.Value)
                throw new Exception("Can\'t update DataCategory. This DataCategory isn\'t updatable");

            dataCategory.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
