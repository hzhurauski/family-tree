using FamilyTree.Domain.Common;
using FamilyTree.Domain.Entities.Privacy;
using FamilyTree.Domain.Enums.PersonContent;

namespace FamilyTree.Domain.Entities.PersonContent
{
    public class DataHolder : AuditableEntity
    {
        public int Id { get; set; }

        public DataHolderType DataHolderType { get; set; }

        public string Title { get; set; }

        public string Data { get; set; }

        public bool? IsDeletable { get; set; }

        public int OrderNumber { get; set; }

        public int DataBlockId { get; set; }

        public DataBlock DataBlock { get; set; }

        public int PrivacyId { get; set; }

        public PrivacyEntity Privacy { get; set; }
    }
}