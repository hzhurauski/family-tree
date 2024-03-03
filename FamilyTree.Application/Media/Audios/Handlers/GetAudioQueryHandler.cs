using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Audios.Queries;
using FamilyTree.Application.Media.Audios.ViewModels;
using FamilyTree.Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Media.Audios.Handlers
{
    public class GetAudioQueryHandler : IRequestHandler<GetAudioQuery, AudioVm>
    {
        private readonly IApplicationDbContext _context;

        public GetAudioQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AudioVm> Handle(GetAudioQuery request, CancellationToken cancellationToken)
        {
            Audio audio = await _context.Audios
                .SingleOrDefaultAsync(a => a.CreatedBy.Equals(request.UserId) &&
                                           a.Id == request.Id,
                                      cancellationToken);

            if (audio == null)
                throw new NotFoundException(nameof(Audio), request.Id);

            AudioVm result = new AudioVm();
            result.FileStream = new FileStream(audio.FilePath, FileMode.Open, FileAccess.Read);
            result.FileType = audio.FileType;

            return result;
        }
    }
}
