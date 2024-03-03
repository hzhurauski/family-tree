using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Copying.Commands;
using FamilyTree.Application.Media.Images.Commands;
using FamilyTree.Application.Media.Images.Queries;
using FamilyTree.Application.Media.Images.ViewModels;
using FamilyTree.Controllers.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FamilyTree.Controllers.Media
{
    [Authorize]
    [ApiController]
    [Route("Media/[controller]/[action]/{id?}")]
    public class ImageController : ApiControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public ImageController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ImageDto>>> GetAll(int dataBlockId)
        {
            return await Mediator.Send(new GetImagesQuery()
            {
                UserId = _currentUserService.UserId,
                DataBlockId = dataBlockId
            });
        }

        [HttpGet]
        public async Task<FileResult> GetFile(int id)
        {
            var result = await Mediator.Send(new GetImageQuery()
            {
                UserId = _currentUserService.UserId,
                Id = id
            });

            return File(result.ImageData, $"image/{result.ImageType}", true);
        }

        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = 2147483647L)]
        [RequestSizeLimit(2147483647L)]
        public async Task<ActionResult<int>> Create([FromForm] CreateImageCommand command)
        {
            command.UserId = _currentUserService.UserId;

            return await Mediator.Send(command);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateDetails(int id, UpdateImageDetailsCommand command)
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
            await Mediator.Send(new DeleteImageCommand() 
            {
                Id = id,
                UserId = _currentUserService.UserId
            });

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult> Copy(CopyImagesCommand command)
        {
            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }        
    }
}
