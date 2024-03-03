using System;
using System.Collections.Generic;
using System.Text;

namespace FamilyTree.Application.People.ViewModels
{
    public class PartModel
    {
        public string DataHolderType { get; set; }
        public string Data { get; set; }
        public bool IsDeletable { get; set; }
        public int DataBlockId { get; set; }
    }
}
