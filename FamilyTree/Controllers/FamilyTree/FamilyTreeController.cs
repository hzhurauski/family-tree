using System.Collections.Generic;
using System.Threading.Tasks;
using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.FamilyTrees.Commands;
using FamilyTree.Application.FamilyTrees.Queries;
using FamilyTree.Application.FamilyTrees.ViewModels;
using FamilyTree.Controllers.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FamilyTree.Controllers.FamilyTree
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class FamilyTreeController : ApiControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public FamilyTreeController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpPost("create")]
        public async Task<ActionResult<int>> Create(CreateFamilyTreeCommand command)
        {
            command.UserId = _currentUserService.UserId;

            return await Mediator.Send(command);
        }

        [HttpGet("")]
        public async Task<ActionResult<List<FamilyTreeEntityDto>>> GetAll()
        {
            return await Mediator.Send(new GetFamilyTreesQuery() { UserId = _currentUserService.UserId });
        }

        [HttpGet("getTree")]
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

        [HttpGet("getBloodTree")]
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

        [HttpPut("updateName")]
        public async Task<ActionResult> UpdateName(int id, UpdateFamilyTreeNameCommand command)
        {
            if (id != command.Id)
                return BadRequest();

            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpPut("updateMainPerson")]
        public async Task<ActionResult> UpdateMainPerson(int id, UpdateFamilyTreeMainPersonCommand command)
        {
            if (id != command.Id)
                return BadRequest();

            command.UserId = _currentUserService.UserId;

            try
            {
                await Mediator.Send(command);
            }
            catch(NotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPost("shareFamilyTree")]
        public async Task<ActionResult> ShareFamilyTree(ShareFamilyTreeCommand command)
        {
            command.UserId = _currentUserService.UserId;

            try
            {
                await Mediator.Send(command);
            }
            catch (NotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("delete")]
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