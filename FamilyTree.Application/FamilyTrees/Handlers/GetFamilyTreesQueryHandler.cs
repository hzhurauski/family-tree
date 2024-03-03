using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.FamilyTrees.Queries;
using FamilyTree.Application.FamilyTrees.ViewModels;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.FamilyTrees.Handlers
{
    public class GetFamilyTreesQueryHandler : IRequestHandler<GetFamilyTreesQuery, List<FamilyTreeEntityDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetFamilyTreesQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<FamilyTreeEntityDto>> Handle(GetFamilyTreesQuery request, CancellationToken cancellationToken)
        {
            var query = from ft in _context.FamilyTrees
                join st in _context.SharedTrees on ft.Id equals st.FamilyTreeId into gj
                from sht in gj.DefaultIfEmpty()
                where ft.UserId.Equals(request.UserId) || sht.SharedPersonId.Equals(request.UserId)
                select new FamilyTreeEntityDto()
                {
                    Id = ft.Id,
                    Name = ft.Name,
                    MainPersonId = ft.MainPersonId
                };

            List<FamilyTreeEntityDto> result = await query.ToListAsync(cancellationToken);

            return result.GroupBy(dto => dto.Id).Select(x => x.First()).ToList();
        }
    }
}
