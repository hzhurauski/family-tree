using MediatR;

namespace FamilyTree.Application.PersonContent.DataHolders.Commands
{
    public class UpdateDataHolderOrderCommand : IRequest
    {
        public int Id { get; set; }

        public int Order { get; set; }

        public string UserId { get; set; }
    }
}
