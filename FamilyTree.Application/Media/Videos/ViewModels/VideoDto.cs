using FamilyTree.Application.Privacy.ViewModels;

namespace FamilyTree.Application.Media.Videos.ViewModels
{
    public class VideoDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string PreviewImageData { get; set; }

        public string PreviewImageType { get; set; }

        public PrivacyEntityDto Privacy { get; set; }
    }
}
