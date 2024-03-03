using FamilyTree.Domain.Entities.Media;

namespace FamilyTree.Domain.Entities.PersonContent
{
    public class DataBlockImage
    {
        public int Id { get; set; }

        public int ImageId { get; set; }

        public Image Image { get; set; }

        public int DataBlockId { get; set; }

        public DataBlock DataBlock { get; set; }
    }
}
