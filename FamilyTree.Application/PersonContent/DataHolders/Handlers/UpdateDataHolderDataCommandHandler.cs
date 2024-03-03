using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataHolders.Commands;
using FamilyTree.Domain.Entities.PersonContent;
using FamilyTree.Domain.Enums.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataHolders.Handlers
{
    public class UpdateDataHolderDataCommandHandler : IRequestHandler<UpdateDataHolderDataCommand>
    {
        private readonly IApplicationDbContext _context;

        private static readonly DataHolderType[] _dateDataTypes = new[] { DataHolderType.Date, DataHolderType.Birthday, DataHolderType.DateTime, DataHolderType.Time };

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

            dataHolder.Data = _dateDataTypes.Contains(dataHolder.DataHolderType)
                ? DateTime.Parse(request.Data).ToString("dd-MM-yyyy")
                : request.Data;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
