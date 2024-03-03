using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Audios.Commands;
using FamilyTree.Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Media.Audios.Handlers
{
    public class UpdateAudioDetailsCommandHandler : IRequestHandler<UpdateAudioDetailsCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateAudioDetailsCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateAudioDetailsCommand request, CancellationToken cancellationToken)
        {
            Audio audio = await _context.Audios
                .SingleOrDefaultAsync(i => i.CreatedBy.Equals(request.UserId) &&
                                           i.Id == request.Id,
                                      cancellationToken);

            if (audio == null)
                throw new NotFoundException(nameof(Audio), request.Id);

            audio.Title = request.Title;
            audio.Description = request.Description;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
