using FamilyTree.Application.Privacy.ViewModels;

namespace FamilyTree.Application.Media.Images.ViewModels
{
    public class ImageDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public PrivacyEntityDto Privacy { get; set; }
    }
}
