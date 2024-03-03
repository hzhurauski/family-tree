using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataHolders.Queries;
using FamilyTree.Application.PersonContent.DataHolders.ViewModels;
using FamilyTree.Application.Privacy.ViewModels;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataHolders.Handlers
{
    public class GetDataHolderQueryHandler : IRequestHandler<GetDataHolderQuery, DataHolderDto>
    {
        private readonly IApplicationDbContext _context;

        public GetDataHolderQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DataHolderDto> Handle(GetDataHolderQuery request, CancellationToken cancellationToken)
        {
            DataHolder dataHolder = await _context.DataHolders
                .Include(dh => dh.Privacy)
                .SingleOrDefaultAsync(i => i.CreatedBy.Equals(request.UserId) &&
                                           i.Id == request.Id,
                                      cancellationToken);

            if (dataHolder == null)
                throw new NotFoundException(nameof(DataHolder), request.Id);

            DataHolderDto result = new DataHolderDto()
            {
                Id = dataHolder.Id,
                Title = dataHolder.Title,
                Data = dataHolder.Data,
                DataHolderType = dataHolder.DataHolderType,
                IsDeletable = dataHolder.IsDeletable.Value,
                Privacy = new PrivacyEntityDto() 
                {
                    Id = dataHolder.Privacy.Id,
                    BeginDate = dataHolder.Privacy.BeginDate,
                    EndDate = dataHolder.Privacy.EndDate,
                    IsAlways = dataHolder.Privacy.IsAlways.Value,
                    PrivacyLevel = dataHolder.Privacy.PrivacyLevel
                }
            };

            return result;
        }
    }
}
