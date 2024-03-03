using MediatR;

namespace FamilyTree.Application.PersonContent.DataBlocks.Commands
{
    public class UpdateDataBlockTitleCommand : IRequest
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string UserId { get; set; }
    }
}
