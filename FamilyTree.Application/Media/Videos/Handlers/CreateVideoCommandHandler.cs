using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Domain.Entities.Media;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using FamilyTree.Application.Media.Videos.Interfaces;
using FamilyTree.Domain.Entities.Privacy;
using FamilyTree.Domain.Enums.Privacy;
using FamilyTree.Application.Media.Videos.Commands;

namespace FamilyTree.Application.Media.Videos.Handlers
{
    public class CreateVideoCommandHandler : IRequestHandler<CreateVideoCommand, int>
    {
        private readonly IApplicationDbContext _context;

        private readonly IConfiguration _configuration;

        private readonly IVideoThumbnailService _thumbnailService;

        public CreateVideoCommandHandler(IApplicationDbContext context, 
            IConfiguration configuration, 
            IVideoThumbnailService thumbnailService)
        {
            _context = context;
            _configuration = configuration;
            _thumbnailService = thumbnailService;
        }

        public async Task<int> Handle(CreateVideoCommand request, CancellationToken cancellationToken)
        {
            DataBlock dataBlock = await _context.DataBlocks
                .Include(db => db.DataCategory)
                .ThenInclude(dc => dc.Person)
                .SingleOrDefaultAsync(db => db.CreatedBy.Equals(request.UserId) &&
                                            db.Id == request.DataBlockId,
                                      cancellationToken);

            if (dataBlock == null)
                throw new NotFoundException(nameof(DataBlock), request.DataBlockId);
            
            int treeId = dataBlock.DataCategory.Person.FamilyTreeId;
            int personId = dataBlock.DataCategory.PersonId;
            int dataCategoryId = dataBlock.DataCategoryId;

            string rootPath = Path.Combine(_configuration["FilesStorageFolderPath"],
                _configuration["UploadsFolderPath"]);

            string subDirectoryPath = $"{treeId}_tree\\{personId}_person\\" +
                $"{dataCategoryId}_datacategory\\{dataBlock.Id}_datablock\\Videos";

            string directoryPath = Path.Combine(rootPath, subDirectoryPath);
            string fileType = request.VideoFile.ContentType.Split('/')[1];
            string fileName = $"{Guid.NewGuid()}.{fileType}";
            string filePath = Path.Combine(directoryPath, fileName);

            Directory.CreateDirectory(directoryPath);

            using (var stream = File.OpenWrite(filePath))
            {
                await request.VideoFile.CopyToAsync(stream);
            }

            Video entity = new Video()
            {
                Title = request.Title,
                Description = request.Description,
                FilePath = filePath,
                FileType = fileType,
                PreviewImageData = _thumbnailService.GetVideoThumbnailBytes(filePath),
                PreviewImageType = "jpeg",
                Privacy = new PrivacyEntity()
                {
                    PrivacyLevel = PrivacyLevel.Confidential,
                    IsAlways = true
                }
            };

            DataBlockVideo dataBlockVideo = new DataBlockVideo() 
            {
                DataBlock = dataBlock,
                Video = entity
            };

            _context.Videos.Add(entity);
            _context.DataBlockVideos.Add(dataBlockVideo);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
