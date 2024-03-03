using FamilyTree.Domain.Entities.Tree;
using System;
using System.Collections.Generic;
using System.Text;

namespace FamilyTree.Domain.Entities.PersonContent
{
    public class PersonToDataBlocks
    {
        public Guid Id { get; set; }

        public int PersonId { get; set; }
        public Person Person { get; set; }

        public int DataBlockId { get; set; }
        public DataBlock DataBlock { get; set; }
    }
}
