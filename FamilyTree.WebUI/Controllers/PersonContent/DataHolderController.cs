using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Copying.Commands;
using FamilyTree.Application.PersonContent.DataHolders.Commands;
using FamilyTree.Application.PersonContent.DataHolders.Queries;
using FamilyTree.Application.PersonContent.DataHolders.ViewModels;
using FamilyTree.WebUI.Controllers.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FamilyTree.WebUI.Controllers.PersonContent
{
    [Authorize]
    [Route("PersonContent/[controller]/[action]/{id?}")]
    public class DataHolderController : ApiControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public DataHolderController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<ActionResult<DataHolderDto>> Get(int id)
        {
            return await Mediator.Send(new GetDataHolderQuery() 
            {
                Id = id,
                UserId = _currentUserService.UserId
            });
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateDataHolderCommand command)
        {
            command.UserId = _currentUserService.UserId;

            return await Mediator.Send(command);
        }

        [HttpPost]
        public async Task<ActionResult> Copy(CopyDataHoldersCommand command)
        {
            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateData(int id, UpdateDataHolderDataCommand command)
        {
            if (id != command.Id)
                return BadRequest();

            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateTitle(int id, UpdateDataHolderTitleCommand command)
        {
            if (id != command.Id)
                return BadRequest();

            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateOrder(int id, UpdateDataHolderOrderCommand command)
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
            await Mediator.Send(new DeleteDataHolderCommand() 
            {
                Id = id,
                UserId = _currentUserService.UserId
            });

            return NoContent();
        }
    }
}
