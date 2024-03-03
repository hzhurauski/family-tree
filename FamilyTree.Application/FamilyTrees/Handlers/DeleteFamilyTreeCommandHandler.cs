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
    public class DeleteFamilyTreeCommandHandler : IRequestHandler<DeleteFamilyTreeCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteFamilyTreeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteFamilyTreeCommand request, CancellationToken cancellationToken)
        {
            FamilyTreeEntity entity = await _context.FamilyTrees
                .Where(t => t.CreatedBy.Equals(request.UserId) && 
                            (t.Id == request.Id))
                .SingleOrDefaultAsync(cancellationToken);

            if (entity == null)
                throw new NotFoundException(nameof(FamilyTreeEntity), request.Id);

            _context.FamilyTrees.Remove(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
