using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.User.Queries;
using FamilyTree.Application.User.ViewModels;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.User.Handlers
{
    public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, List<AppUserDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetUsersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<AppUserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            List<AppUserDto> result = await _context.AppUsers
                .Select(appUser => new AppUserDto()
                {
                    Id = appUser.Id,
                    Username = appUser.UserName
                })
                .ToListAsync(cancellationToken);
            return result;
        }
    }
}
