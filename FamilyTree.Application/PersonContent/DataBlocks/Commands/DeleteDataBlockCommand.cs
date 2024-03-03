using MediatR;

namespace FamilyTree.Application.PersonContent.DataBlocks.Commands
{
    public class DeleteDataBlockCommand : IRequest
    {
        public int Id { get; set; }

        public string UserId { get; set; }
    }
}
