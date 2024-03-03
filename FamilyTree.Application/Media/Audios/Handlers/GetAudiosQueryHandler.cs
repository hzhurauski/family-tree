using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Audios.Queries;
using FamilyTree.Application.Media.Audios.ViewModels;
using FamilyTree.Application.Privacy.ViewModels;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Media.Audios.Handlers
{
    public class GetAudiosQueryHandler : IRequestHandler<GetAudiosQuery, List<AudioDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetAudiosQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<AudioDto>> Handle(GetAudiosQuery request, CancellationToken cancellationToken)
        {
            DataBlock dataBlock = await _context.DataBlocks
                .SingleOrDefaultAsync(db => db.CreatedBy.Equals(request.UserId) &&
                                            db.Id == request.DataBlockId,
                                      cancellationToken);

            if (dataBlock == null)
                throw new NotFoundException(nameof(DataBlock), request.DataBlockId);

            var audios = await _context.DataBlockAudios
                .Include(dba => dba.Audio)
                .Where(dba => dba.DataBlockId == dataBlock.Id)
                .Select(dba => new AudioDto()
                {
                    Id = dba.AudioId,
                    Title = dba.Audio.Title,
                    Description = dba.Audio.Description,
                    Privacy = new PrivacyEntityDto()
                    {
                        Id = dba.Audio.Privacy.Id,
                        BeginDate = dba.Audio.Privacy.BeginDate,
                        EndDate = dba.Audio.Privacy.EndDate,
                        IsAlways = dba.Audio.Privacy.IsAlways.Value,
                        PrivacyLevel = dba.Audio.Privacy.PrivacyLevel
                    }
                })
                .ToListAsync(cancellationToken);

            return audios;
        }
    }
}
