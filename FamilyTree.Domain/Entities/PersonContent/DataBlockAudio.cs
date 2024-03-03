using FamilyTree.Domain.Entities.Media;

namespace FamilyTree.Domain.Entities.PersonContent
{
    public class DataBlockAudio
    {
        public int Id { get; set; }

        public int DataBlockId { get; set; }

        public DataBlock DataBlock { get; set; }

        public int AudioId { get; set; }

        public Audio Audio { get; set; }
    }
}
