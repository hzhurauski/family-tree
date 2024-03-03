using FamilyTree.Domain.Enums.PersonContent;
using MediatR;

namespace FamilyTree.Application.PersonContent.DataCategories.Commands
{
    public class CreateDataCategoryCommand : IRequest<int>
    {
        public DataCategoryType DataCategoryType { get; set; }

        public string Name { get; set; }

        public int PersonId { get; set; }

        public string UserId { get; set; }
    }
}
