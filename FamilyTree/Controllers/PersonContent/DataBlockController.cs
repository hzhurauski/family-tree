using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Copying.Commands;
using FamilyTree.Application.PersonContent.DataBlocks.Commands;
using FamilyTree.Controllers.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FamilyTree.Controllers.PersonContent
{
    [Authorize]
    [ApiController]
    [Route("PersonContent/[controller]/[action]/{id?}")]
    public class DataBlockController : ApiControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public DataBlockController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateDataBlockCommand command)
        {
            command.UserId = _currentUserService.UserId;

            return await Mediator.Send(command);
        }

        [HttpPost]
        public async Task<ActionResult> Copy(CopyDataBlocksCommand command)
        {
            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateTitle(int id, UpdateDataBlockTitleCommand command)
        {
            if (id != command.Id)
                return BadRequest();

            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateOrder(int id, UpdateDataBlockOrderCommand command)
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
            await Mediator.Send(new DeleteDataBlockCommand()
            {
                Id = id,
                UserId = _currentUserService.UserId
            });

            return NoContent();
        }        
    }
}
