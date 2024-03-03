using MediatR;

namespace FamilyTree.Application.PersonContent.DataHolders.Commands
{
    public class DeleteDataHolderCommand : IRequest
    {
        public int Id { get; set; }

        public string UserId { get; set; }
    }
}
