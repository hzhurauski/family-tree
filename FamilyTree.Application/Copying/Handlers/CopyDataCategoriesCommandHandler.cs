using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Copying.Commands;
using FamilyTree.Application.Copying.Interfaces;
using FamilyTree.Domain.Entities.Tree;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Copying.Handlers
{
    public class CopyDataCategoriesCommandHandler : IRequestHandler<CopyDataCategoriesCommand>
    {
        private readonly IApplicationDbContext _context;

        private readonly ICopyingService _copying;

        public CopyDataCategoriesCommandHandler(IApplicationDbContext context, ICopyingService copying)
        {
            _context = context;
            _copying = copying;
        }

        public async Task<Unit> Handle(CopyDataCategoriesCommand request, CancellationToken cancellationToken)
        {
            Person person = await _context.People
                .SingleOrDefaultAsync(p => p.CreatedBy.Equals(request.UserId) &&
                                           p.Id == request.PersonId,
                                      cancellationToken);

            if (person == null)
                throw new NotFoundException(nameof(Person), request.PersonId);

            var dataCategories = await _context.DataCategories
                .Include(dc => dc.DataBlocks)
                .ThenInclude(db => db.DataHolders)
                .ThenInclude(dh => dh.Privacy)
                .Where(dc => dc.CreatedBy.Equals(request.UserId) &&
                             request.DataCategoriesIds.Contains(dc.Id))
                .ToListAsync(cancellationToken);

            foreach (var dataCategory in dataCategories)
            {
                await _copying.CopyDataCategoryToPerson(person, dataCategory, cancellationToken);
            }

            return Unit.Value;
        }
    }
}
