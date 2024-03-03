using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Audios.Queries;
using FamilyTree.Application.Media.Audios.ViewModels;
using FamilyTree.Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Linq;
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
            var userId = request.UserId;
            /*var sharedTree = await _context.FamilyTrees
                .Join(_context.SharedTrees, ft => ft.Id, st => st.FamilyTreeId, (ft, st) => new
                {
                    FamilyTree = ft,
                    SharedTree = st
                })
                .Where(jn => (jn.FamilyTree.UserId.Equals(userId) || jn.SharedTree.SharedPersonId.Equals(userId) && jn.FamilyTree.Id == treeId))
                .Select(jn => new
                {
                    Id = jn.FamilyTree.Id,
                    Name = jn.FamilyTree.Name,
                    MainPersonId = jn.FamilyTree.MainPersonId,
                    UserId = jn.FamilyTree.UserId
                })
                .SingleOrDefaultAsync(cancellationToken);

            if (sharedTree != null)
            {
                userId = sharedTree.UserId;
            }
            */
            Audio audio = await _context.Audios
                .SingleOrDefaultAsync(a => a.CreatedBy.Equals(userId) &&
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
