using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Participants.Queries;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Media.Participants.Handlers
{
    internal class InsertParticipantsCommandHandler : IRequestHandler<InsertParticipantsCommand>
    {
        private readonly IApplicationDbContext _context;

        public InsertParticipantsCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(InsertParticipantsCommand request, CancellationToken cancellationToken)
        {
            if (request is null)
                throw new ArgumentNullException(nameof(request));

            var existingDataBlockIds = await _context.PersonToDataBlocks
                .Where(x => x.PersonId == request.ParticipantId && request.DataBlockIds.Contains(x.DataBlockId))
                .Select(x => x.DataBlockId)
                .ToArrayAsync();

            var participantsDataBlocks = await _context.DataBlocks
                .Where(x => x.DataCategory.PersonId == request.ParticipantId)
                .Select(x => x.Id)
                .ToArrayAsync();

            _context.PersonToDataBlocks.AddRange(request.DataBlockIds
                .Where(x => !existingDataBlockIds.Contains(x))
                .Where(x => !participantsDataBlocks.Contains(x))
                .Select(x => new PersonToDataBlocks
                {
                    DataBlockId = x,
                    PersonId = request.ParticipantId,
                }));

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
