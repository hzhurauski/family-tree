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
    public class UpdateFamilyTreeNameCommandHandler : IRequestHandler<UpdateFamilyTreeNameCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateFamilyTreeNameCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateFamilyTreeNameCommand request, CancellationToken cancellationToken)
        {
            FamilyTreeEntity entity = await _context.FamilyTrees
                .Where(t => t.CreatedBy.Equals(request.UserId) &&
                            (t.Id == request.Id))
                .SingleOrDefaultAsync(cancellationToken);

            if (entity == null)
                throw new NotFoundException(nameof(FamilyTreeEntity), request.Id);

            entity.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
