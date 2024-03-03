using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataHolders.Queries;
using FamilyTree.Application.PersonContent.DataHolders.ViewModels;
using FamilyTree.Application.Privacy.ViewModels;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
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
            var userId = request.UserId;
            /*var sharedTree = await _context.FamilyTrees
                .Join(_context.SharedTrees, ft => ft.Id, st => st.FamilyTreeId, (ft, st) => new
                {
                    FamilyTree = ft,
                    SharedTree = st
                })
                .Where(jn => (jn.FamilyTree.UserId.Equals(userId) || jn.SharedTree.SharedPersonId.Equals(userId) && jn.FamilyTree.Id == treeId))
                .Select(jn => new
                {
                    Id = jn.FamilyTree.Id,
                    Name = jn.FamilyTree.Name,
                    MainPersonId = jn.FamilyTree.MainPersonId,
                    UserId = jn.FamilyTree.UserId
                })
                .SingleOrDefaultAsync(cancellationToken);

            if (sharedTree != null)
            {
                userId = sharedTree.UserId;
            }*/

            DataHolder dataHolder = await _context.DataHolders
                .Include(dh => dh.Privacy)
                .SingleOrDefaultAsync(i => i.CreatedBy.Equals(userId) &&
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
