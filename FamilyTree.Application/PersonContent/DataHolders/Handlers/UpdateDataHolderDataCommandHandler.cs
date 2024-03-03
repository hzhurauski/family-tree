using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataHolders.Commands;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataHolders.Handlers
{
    public class UpdateDataHolderDataCommandHandler : IRequestHandler<UpdateDataHolderDataCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDataHolderDataCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateDataHolderDataCommand request, CancellationToken cancellationToken)
        {
            var dataHolder = await _context.DataHolders
                .SingleOrDefaultAsync(dh => dh.CreatedBy.Equals(request.UserId) &&
                                            dh.Id == request.Id, 
                                      cancellationToken);

            if (dataHolder == null)
                throw new NotFoundException(nameof(DataHolder), request.Id);

            dataHolder.Data = request.Data;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
