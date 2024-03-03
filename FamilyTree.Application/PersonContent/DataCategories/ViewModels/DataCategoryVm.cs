using FamilyTree.Application.PersonContent.DataBlocks.ViewModels;
using FamilyTree.Domain.Enums.PersonContent;
using System.Collections.Generic;

namespace FamilyTree.Application.PersonContent.DataCategories.ViewModels
{
    public class DataCategoryVm
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DataCategoryType DataCategoryType { get; set; }

        public bool IsDeletable { get; set; }

        public List<DataBlockDto> DataBlocks { get; set; }
    }
}
