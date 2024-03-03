using FamilyTree.Application.PersonContent.DataCategories.ViewModels;
using MediatR;

namespace FamilyTree.Application.PersonContent.DataCategories.Queries
{
    public class GetDataCategoryQuery : IRequest<DataCategoryVm>
    {
        public string UserId { get; set; }

        public int DataCategoryId { get; set; }
    }
}
