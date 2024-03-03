using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.People.Commands;
using FamilyTree.Domain.Entities.Media;
using FamilyTree.Domain.Entities.Tree;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.People.Handlers
{
    public class UpdatePersonAvatarImageCommandHandler : IRequestHandler<UpdatePersonAvatarImageCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdatePersonAvatarImageCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdatePersonAvatarImageCommand request, CancellationToken cancellationToken)
        {
            Person person = await _context.People
                .SingleOrDefaultAsync(p => p.CreatedBy.Equals(request.UserId) &&
                                           p.Id == request.Id,
                                      cancellationToken);

            if (person == null)
                throw new NotFoundException(nameof(Person), request.Id);

            Image image = await _context.Images
                .SingleOrDefaultAsync(i => i.CreatedBy.Equals(request.UserId) &&
                                           i.Id == request.ImageId,
                                      cancellationToken);

            if (image == null)
                throw new NotFoundException(nameof(Image), request.ImageId);

            person.AvatarImage = image;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
