using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataCategories.Queries;
using FamilyTree.Application.PersonContent.DataCategories.ViewModels;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataCategories.Handlers
{
    public class GetDataCategoriesQueryHandler : IRequestHandler<GetDataCategoriesQuery, List<DataCategoryDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetDataCategoriesQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DataCategoryDto>> Handle(GetDataCategoriesQuery request, CancellationToken cancellationToken)
        {
            List<DataCategoryDto> result =  await _context.DataCategories
                .Where(dc => dc.CreatedBy.Equals(request.UserId) &&
                             dc.PersonId == request.PersonId)
                .OrderBy(dc => dc.OrderNumber)
                .Select(dc => new DataCategoryDto() { Id = dc.Id, Name = dc.Name })
                .ToListAsync(cancellationToken);

            return result;
        }
    }
}
