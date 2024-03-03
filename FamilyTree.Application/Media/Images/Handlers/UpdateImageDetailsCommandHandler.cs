using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Images.Commands;
using FamilyTree.Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Media.Images.Handlers
{
    public class UpdateImageDetailsCommandHandler : IRequestHandler<UpdateImageDetailsCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateImageDetailsCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateImageDetailsCommand request, CancellationToken cancellationToken)
        {
            Image image = await _context.Images
                .SingleOrDefaultAsync(i => i.CreatedBy.Equals(request.UserId) &&
                                           i.Id == request.Id,
                                      cancellationToken);

            if (image == null)
                throw new NotFoundException(nameof(Image), request.Id);

            image.Title = request.Title;
            image.Description = request.Description;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
