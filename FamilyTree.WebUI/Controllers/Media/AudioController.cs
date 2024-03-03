using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Copying.Commands;
using FamilyTree.Application.Media.Audios.Commands;
using FamilyTree.Application.Media.Audios.Queries;
using FamilyTree.Application.Media.Audios.ViewModels;
using FamilyTree.WebUI.Controllers.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FamilyTree.WebUI.Controllers.Media
{
    [Authorize]
    [Route("Media/[controller]/[action]/{id?}")]
    public class AudioController : ApiControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public AudioController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<ActionResult<List<AudioDto>>> GetAll(int dataBlockId)
        {
            return await Mediator.Send(new GetAudiosQuery()
            {
                UserId = _currentUserService.UserId,
                DataBlockId = dataBlockId
            });
        }

        [HttpGet]
        public async Task<FileResult> GetFile(int id)
        {
            var fileVm = await Mediator.Send(new GetAudioQuery()
            {
                UserId = _currentUserService.UserId,
                Id = id
            });

            return File(fileVm.FileStream, $"audio/{fileVm.FileType}", true);
        }

        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = 1099511627776L)]
        [RequestSizeLimit(1099511627776L)]
        public async Task<ActionResult<int>> Create(CreateAudioCommand command)
        {
            command.UserId = _currentUserService.UserId;

            return await Mediator.Send(command);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateDetails(int id, UpdateAudioDetailsCommand command)
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
            await Mediator.Send(new DeleteAudioCommand()
            {
                Id = id,
                UserId = _currentUserService.UserId
            });

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult> Copy(CopyAudiosCommand command)
        {
            command.UserId = _currentUserService.UserId;

            await Mediator.Send(command);

            return NoContent();
        }
    }
}
