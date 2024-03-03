using System.Threading.Tasks;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.People.Commands;
using FamilyTree.Application.People.Queries;
using FamilyTree.Application.People.ViewModels;
using FamilyTree.WebUI.Controllers.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FamilyTree.WebUI.Controllers.People
{
    [Authorize]
    public class PeopleController : ApiControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public PeopleController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreatePersonCommand command)
        {
            command.UserId = _currentUserService.UserId;

            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<PersonDto>> Get(int id)
        {
            return await Mediator.Send(new GetPersonQuery()
            {
                Id = id,
                UserId = _currentUserService.UserId
            });
        }

        [HttpGet]
        public async Task<ActionResult<string>> GetRelationsByPeopleIds(int treeId, int targetPersonId, int personId)
        {
            var res =  await Mediator.Send(new GetRelationsByPeopleIdsQuery()
            {
                UserId = _currentUserService.UserId,
                TargetPersonId = targetPersonId,
                PersonId = personId,
                FamilyTreeId = treeId
            });

            return res;
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAvatarImage(int id, UpdatePersonAvatarImageCommand command)
        {
            if (command.Id != id)
                return BadRequest();

            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpDelete]
        public async Task<ActionResult> Delete(int id)
        {
            await Mediator.Send(new DeletePersonCommand() 
            {
                Id = id,
                UserId = _currentUserService.UserId
            });

            return NoContent();
        }
    }
}