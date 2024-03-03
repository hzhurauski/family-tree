using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Copying.Commands;
using FamilyTree.Application.PersonContent.DataCategories.Commands;
using FamilyTree.Application.PersonContent.DataCategories.Queries;
using FamilyTree.Application.PersonContent.DataCategories.ViewModels;
using FamilyTree.WebUI.Controllers.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FamilyTree.WebUI.Controllers.PersonContent
{
    [Authorize]
    [Route("PersonContent/[controller]/[action]/{id?}")]
    public class DataCategoryController : ApiControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public DataCategoryController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<ActionResult<List<DataCategoryDto>>> GetAll(int personId)
        {
            return await Mediator.Send(new GetDataCategoriesQuery() 
            {
                PersonId = personId,
                UserId = _currentUserService.UserId
            });
        }

        [HttpGet]
        public async Task<ActionResult<DataCategoryVm>> Get(int id)
        {
            return await Mediator.Send(new GetDataCategoryQuery()
            {
                DataCategoryId = id,
                UserId = _currentUserService.UserId
            });
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateDataCategoryCommand command)
        {
            command.UserId = _currentUserService.UserId;

            return await Mediator.Send(command);
        }

        [HttpPost]
        public async Task<ActionResult> Copy(CopyDataCategoriesCommand command)
        {
            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateName(int id, UpdateDataCategoryNameCommand command)
        {
            if (id != command.Id)
                return BadRequest();

            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateOrder(int id, UpdateDataCategoryOrderCommand command)
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
            await Mediator.Send(new DeleteDataCategoryCommand()
            {
                Id = id,
                UserId = _currentUserService.UserId
            });

            return NoContent();
        }
    }
}
