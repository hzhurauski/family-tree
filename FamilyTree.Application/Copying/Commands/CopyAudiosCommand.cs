using MediatR;
using System.Collections.Generic;

namespace FamilyTree.Application.Copying.Commands
{
    public class CopyAudiosCommand : IRequest
    {
        public List<int> AudiosIds { get; set; }

        public int DataBlockId { get; set; }

        public string UserId { get; set; }
    }
}
