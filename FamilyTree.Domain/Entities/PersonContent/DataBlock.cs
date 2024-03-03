using FamilyTree.Domain.Common;
using System.Collections.Generic;

namespace FamilyTree.Domain.Entities.PersonContent
{
    public class DataBlock : AuditableEntity
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public int OrderNumber { get; set; }

        public int DataCategoryId { get; set; }

        public DataCategory DataCategory { get; set; }

        public ICollection<DataHolder> DataHolders { get; set; }
    }
}