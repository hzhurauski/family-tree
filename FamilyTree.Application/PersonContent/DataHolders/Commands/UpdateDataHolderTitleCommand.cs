using MediatR;

namespace FamilyTree.Application.PersonContent.DataHolders.Commands
{
    public class UpdateDataHolderTitleCommand : IRequest
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string UserId { get; set; }
    }
}
