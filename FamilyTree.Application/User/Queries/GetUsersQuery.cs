using FamilyTree.Application.User.ViewModels;
using MediatR;
using System.Collections.Generic;

namespace FamilyTree.Application.User.Queries
{
    public class GetUsersQuery : IRequest<List<AppUserDto>>
    {
        public string UserId { get; set; }
    }
}
