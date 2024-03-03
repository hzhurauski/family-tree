using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Videos.Commands;
using FamilyTree.Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Media.Videos.Handlers
{
    class UpdateVideoDetailsCommandHandler : IRequestHandler<UpdateVideoDetailsCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateVideoDetailsCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateVideoDetailsCommand request, CancellationToken cancellationToken)
        {
            Video video = await _context.Videos
                .SingleOrDefaultAsync(i => i.CreatedBy.Equals(request.UserId) &&
                                           i.Id == request.Id,
                                      cancellationToken);

            if (video == null)
                throw new NotFoundException(nameof(Image), request.Id);

            video.Title = request.Title;
            video.Description = request.Description;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
