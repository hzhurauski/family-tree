using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.FamilyTrees.Commands;
using FamilyTree.Domain.Entities.Tree;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.FamilyTrees.Handlers
{
    public class UpdateFamilyTreeMainPersonCommandHandler : IRequestHandler<UpdateFamilyTreeMainPersonCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateFamilyTreeMainPersonCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateFamilyTreeMainPersonCommand request, CancellationToken cancellationToken)
        {
            FamilyTreeEntity familyTree = await _context.FamilyTrees
                .Include(ft => ft.People)
                .SingleOrDefaultAsync(ft => ft.CreatedBy.Equals(request.UserId) &&
                                            ft.Id == request.Id,
                                      cancellationToken);

            if (familyTree == null)
                throw new NotFoundException(nameof(FamilyTreeEntity), request.Id);

            Person person = familyTree.People
                .SingleOrDefault(p => p.Id == request.PersonId);

            if (person == null)
                throw new NotFoundException(nameof(Person), request.PersonId);

            familyTree.MainPerson = person;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
