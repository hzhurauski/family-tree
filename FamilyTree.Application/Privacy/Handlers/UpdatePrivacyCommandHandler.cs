using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Privacy.Commands;
using FamilyTree.Domain.Entities.Privacy;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Privacy.Handlers
{
    public class UpdatePrivacyCommandHandler : IRequestHandler<UpdatePrivacyCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdatePrivacyCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdatePrivacyCommand request, CancellationToken cancellationToken)
        {
            PrivacyEntity privacy = await _context.Privacies
                .SingleOrDefaultAsync(p => p.CreatedBy.Equals(request.UserId) &&
                                           p.Id == request.Id,
                                      cancellationToken);

            if (privacy == null)
                throw new NotFoundException(nameof(PrivacyEntity), request.Id);

            if (!request.IsAlways.Value)
            {
                privacy.BeginDate = request.BeginDate.Value.ToUniversalTime();
                privacy.EndDate = request.EndDate.Value.ToUniversalTime();
            }

            privacy.IsAlways = request.IsAlways;
            privacy.PrivacyLevel = request.PrivacyLevel.Value;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
