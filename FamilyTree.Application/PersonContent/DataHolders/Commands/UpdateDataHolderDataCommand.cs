using MediatR;

namespace FamilyTree.Application.PersonContent.DataHolders.Commands
{
    public class UpdateDataHolderDataCommand : IRequest
    {
        public int Id { get; set; }

        public string Data { get; set; }

        public string UserId { get; set; }
    }
}
