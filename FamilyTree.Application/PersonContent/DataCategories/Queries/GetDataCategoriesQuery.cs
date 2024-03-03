using FamilyTree.Application.PersonContent.DataCategories.ViewModels;
using MediatR;
using System.Collections.Generic;

namespace FamilyTree.Application.PersonContent.DataCategories.Queries
{
    public class GetDataCategoriesQuery : IRequest<List<DataCategoryDto>>
    {
        public string UserId { get; set; }

        public int PersonId { get; set; }
    }
}
