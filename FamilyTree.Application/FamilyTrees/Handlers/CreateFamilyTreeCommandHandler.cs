using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.FamilyTrees.Commands;
using FamilyTree.Domain.Entities.Tree;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.FamilyTrees.Handlers
{
    public class CreateFamilyTreeCommandHandler : IRequestHandler<CreateFamilyTreeCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateFamilyTreeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<int> Handle(CreateFamilyTreeCommand request, CancellationToken cancellationToken)
        {
            FamilyTreeEntity entity = new FamilyTreeEntity();
            entity.Name = request.Name;
            entity.UserId = request.UserId;

            _context.FamilyTrees.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
