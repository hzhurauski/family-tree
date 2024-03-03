namespace FamilyTree.Application.Media.Videos.Interfaces
{
    public interface IVideoThumbnailService
    {
        byte[] GetVideoThumbnailBytes(string videoFilePath);
    }
}
