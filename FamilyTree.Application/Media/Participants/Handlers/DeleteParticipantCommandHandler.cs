using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Participants.Queries;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Media.Participants.Handlers
{
    internal class DeleteParticipantCommandHandler : IRequestHandler<DeleteParticipantCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteParticipantCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteParticipantCommand request, CancellationToken cancellationToken)
        {
            if (request is null)
                throw new ArgumentNullException(nameof(request));

            var person2DataBlock = _context.PersonToDataBlocks
                .SingleOrDefault(x => request.DataBlockId == x.DataBlockId && request.ParticipantId == x.PersonId);

            if (person2DataBlock is null)
                throw new ArgumentException(nameof(request), "Not existing Person2DataBlock");

            _context.PersonToDataBlocks.Remove(person2DataBlock);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
