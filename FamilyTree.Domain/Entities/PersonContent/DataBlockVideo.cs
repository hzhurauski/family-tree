using FamilyTree.Domain.Entities.Media;

namespace FamilyTree.Domain.Entities.PersonContent
{
    public class DataBlockVideo
    {
        public int Id { get; set; }

        public int VideoId { get; set; }

        public Video Video { get; set; }

        public int DataBlockId { get; set; }

        public DataBlock DataBlock { get; set; }
    }
}
