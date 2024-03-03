using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.FamilyTrees.Queries;
using FamilyTree.Application.User.Queries;
using FamilyTree.Application.User.ViewModels;
using FamilyTree.Controllers.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FamilyTree.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : ApiControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public UserController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult<List<AppUserDto>>> GetAll()
        {
            return await Mediator.Send(new GetUsersQuery() { UserId = _currentUserService.UserId });
        }
    }
}