using MediatR;
using System.Collections.Generic;

namespace FamilyTree.Application.Copying.Commands
{
    public class CopyDataBlocksCommand : IRequest
    {
        public List<int> DataBlocksIds { get; set; }

        public int DataCategoryId { get; set; }

        public string UserId { get; set; }
    }
}
