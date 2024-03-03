using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.FamilyTrees.Commands;
using FamilyTree.Domain.Entities.Identity;
using FamilyTree.Domain.Entities.Tree;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.FamilyTrees.Handlers
{
    public class ShareFamilyTreeCommandHandler : IRequestHandler<ShareFamilyTreeCommand>
    {
        private readonly IApplicationDbContext _context;

        public ShareFamilyTreeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(ShareFamilyTreeCommand request, CancellationToken cancellationToken)
        {
            ApplicationUser user = await _context.AppUsers
                .Where(user => user.UserName == request.UserName.Normalize())
                .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
                throw new NotFoundException(nameof(ApplicationUser), request.Id);

            var tree = await _context.FamilyTrees
                .Where(tree => (tree.Id == request.Id && tree.UserId == request.UserId))
                .FirstOrDefaultAsync(cancellationToken);

            if (tree != null && user.Id != request.UserId)
            {
                var existingRecord = await _context.SharedTrees
                    .Where(st => (st.OwnerId == request.UserId && st.SharedPersonId == user.Id && st.FamilyTreeId == request.Id))
                    .FirstOrDefaultAsync(cancellationToken);

                if (existingRecord == null)
                {
                    var sharedTree = new SharedTree();
                    sharedTree.OwnerId = request.UserId;
                    sharedTree.SharedPersonId = user.Id;
                    sharedTree.FamilyTreeId = request.Id;

                    _context.SharedTrees.Add(sharedTree);
                    await _context.SaveChangesAsync(cancellationToken);
                }
            }
            return Unit.Value;
        }
    }
}
