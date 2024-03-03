using FamilyTree.Application.Media.Videos.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Diagnostics;
using System.IO;

namespace FamilyTree.Application.Media.Videos.Services
{
    public class WindowsVideoThumbnailService : IVideoThumbnailService
    {
        private readonly IConfiguration _configuration;

        public WindowsVideoThumbnailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public byte[] GetVideoThumbnailBytes(string videoFilePath)
        {
            string tempThumbnailPath = Path.Combine(
                Path.Combine(_configuration["FilesStorageFolderPath"], 
                             _configuration["TempFilesFolderPath"]), 
                $"{Guid.NewGuid()}.temp");
            string ffmpegPath = _configuration["FFmpegExecutablePath"];

            var cmd = $"{ffmpegPath} -itsoffset -1 -i \"{videoFilePath}\" -vcodec mjpeg -vframes 1 -an -f rawvideo -s 320x240 \"{tempThumbnailPath}\"";

            var startInfo = new ProcessStartInfo
            {
                WindowStyle = ProcessWindowStyle.Hidden,
                FileName = "cmd.exe",
                Arguments = $"/C {cmd}"
            };

            var process = new Process
            {
                StartInfo = startInfo
            };

            process.Start();
            process.WaitForExit(10000);

            byte[] thumbnailBytes = null;

            if (File.Exists(tempThumbnailPath))
            {
                thumbnailBytes = File.ReadAllBytes(tempThumbnailPath);
                File.Delete(tempThumbnailPath);
            }

            return thumbnailBytes;
        }
    }
}
