using MediatR;

namespace FamilyTree.Application.PersonContent.DataCategories.Commands
{
    public class UpdateDataCategoryNameCommand : IRequest
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string UserId { get; set; }
    }
}
