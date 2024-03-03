using MediatR;

namespace FamilyTree.Application.PersonContent.DataBlocks.Commands
{
    public class CreateDataBlockCommand : IRequest<int>
    {
        public string Title { get; set; }

        public int DataCategoryId { get; set; }

        public string UserId { get; set; }
    }
}
