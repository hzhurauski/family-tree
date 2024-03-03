using FamilyTree.Domain.Common;
using FamilyTree.Domain.Entities.Tree;
using FamilyTree.Domain.Enums.PersonContent;
using System.Collections.Generic;

namespace FamilyTree.Domain.Entities.PersonContent
{    
    public class DataCategory : AuditableEntity
    {
        public int Id { get; set; }
               
        public DataCategoryType DataCategoryType { get; set; }

        public string Name { get; set; }

        public bool? IsDeletable { get; set; }

        public int OrderNumber { get; set; }

        public int PersonId { get; set; }

        public Person Person { get; set; }

        public ICollection<DataBlock> DataBlocks { get; set; }
    }
}