using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Privacy.Commands;
using FamilyTree.Controllers.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FamilyTree.Controllers.Privacy
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class PrivacyController : ApiControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public PrivacyController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpPut("update")]
        public async Task<ActionResult> Update(int id, UpdatePrivacyCommand command)
        {
            if (command.Id != id)
                return BadRequest();

            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }
    }
}
