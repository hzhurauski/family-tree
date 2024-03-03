using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Audios.Commands;
using FamilyTree.Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Media.Audios.Handlers
{
    class DeleteAudioCommandHandler : IRequestHandler<DeleteAudioCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteAudioCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteAudioCommand request, CancellationToken cancellationToken)
        {
            Audio audio = await _context.Audios
                .SingleOrDefaultAsync(v => v.CreatedBy.Equals(request.UserId) &&
                                           v.Id == request.Id,
                                      cancellationToken);

            if (audio == null)
                throw new NotFoundException(nameof(Audio), request.Id);

            int audioLinksCount = await _context.Audios
                .CountAsync(a => a.FilePath.Equals(audio.FilePath),
                            cancellationToken);

            if (audioLinksCount == 1 && File.Exists(audio.FilePath))
                File.Delete(audio.FilePath);

            _context.Audios.Remove(audio);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
