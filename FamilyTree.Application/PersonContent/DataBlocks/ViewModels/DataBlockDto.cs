using FamilyTree.Application.PersonContent.DataHolders.ViewModels;
using System.Collections.Generic;

namespace FamilyTree.Application.PersonContent.DataBlocks.ViewModels
{
    public class DataBlockDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public List<DataHolderDto> DataHolders { get; set; }
    }
}
