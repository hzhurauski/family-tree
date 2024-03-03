using System.Collections.Generic;
using System.Threading.Tasks;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.FamilyTrees.Commands;
using FamilyTree.Application.FamilyTrees.Queries;
using FamilyTree.Application.FamilyTrees.ViewModels;
using FamilyTree.WebUI.Controllers.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FamilyTree.WebUI.Controllers.FamilyTree
{
    [Authorize]
    public class FamilyTreeController : ApiControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public FamilyTreeController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateFamilyTreeCommand command)
        {
            command.UserId = _currentUserService.UserId;

            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<List<FamilyTreeEntityDto>>> GetAll()
        {
            return await Mediator.Send(new GetFamilyTreesQuery() { UserId = _currentUserService.UserId });
        }

        [HttpGet]
        public async Task<ActionResult<FamilyTreeVm>> Get(int id, int personId, int wifeId = 0)
        {
            return await Mediator.Send(new GetFamilyTreeByIdQuery()
            {
                UserId = _currentUserService.UserId,
                FamilyTreeId = id,
                PersonId = personId,
                WifeId = wifeId
            });
        }

        [HttpGet]
        public async Task<ActionResult<BloodTreeVm>> GetBloodTree(int id, int bloodMainId, int currentMainId, int wifeId = 0)
        {
            return await Mediator.Send(new GetBloodTreeByIdQuery() 
            {
                UserId = _currentUserService.UserId,
                FamilyTreeId = id,
                BloodMainId = bloodMainId,
                CurrentMainId = currentMainId,
                WifeId = wifeId
            });
        }        

        [HttpPut]
        public async Task<ActionResult> UpdateName(int id, UpdateFamilyTreeNameCommand command)
        {
            if (id != command.Id)
                return BadRequest();

            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMainPerson(int id, UpdateFamilyTreeMainPersonCommand command)
        {
            if (id != command.Id)
                return BadRequest();

            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpDelete]
        public async Task<ActionResult> Delete(int id)
        {
            await Mediator.Send(new DeleteFamilyTreeCommand() 
            { 
                Id = id,
                UserId = _currentUserService.UserId 
            });

            return NoContent();
        }
    }
}