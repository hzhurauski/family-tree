using MediatR;

namespace FamilyTree.Application.PersonContent.DataCategories.Commands
{
    public class UpdateDataCategoryOrderCommand : IRequest
    {
        public int Id { get; set; }

        public int Order { get; set; }

        public string UserId { get; set; }
    }
}
