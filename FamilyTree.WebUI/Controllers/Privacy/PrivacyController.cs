using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Privacy.Commands;
using FamilyTree.WebUI.Controllers.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FamilyTree.WebUI.Controllers.Privacy
{
    [Authorize]
    public class PrivacyController : ApiControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public PrivacyController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpPut]
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
