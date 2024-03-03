using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataHolders.Commands;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataHolders.Handlers
{
    public class UpdateDataHolderTitleCommandHandler : IRequestHandler<UpdateDataHolderTitleCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDataHolderTitleCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateDataHolderTitleCommand request, CancellationToken cancellationToken)
        {
            var dataHolder = await _context.DataHolders
                .SingleOrDefaultAsync(dh => dh.CreatedBy.Equals(request.UserId) &&
                                            dh.Id == request.Id,
                                      cancellationToken);

            if (dataHolder == null)
                throw new NotFoundException(nameof(DataHolder), request.Id);

            if (!dataHolder.IsDeletable.Value)
                throw new Exception("Can\'t update DataHolder. This DataHolder isn\'t updatable");

            dataHolder.Title = request.Title;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
