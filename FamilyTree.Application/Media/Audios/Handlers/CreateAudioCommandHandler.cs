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
using FamilyTree.Domain.Entities.Privacy;
using FamilyTree.Domain.Enums.Privacy;
using FamilyTree.Application.Media.Audios.Commands;

namespace FamilyTree.Application.Media.Audios.Handlers
{
    public class CreateAudioCommandHandler : IRequestHandler<CreateAudioCommand, int>
    {
        private readonly IApplicationDbContext _context;

        private readonly IConfiguration _configuration;

        public CreateAudioCommandHandler(IApplicationDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<int> Handle(CreateAudioCommand request, CancellationToken cancellationToken)
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
                $"{dataCategoryId}_datacategory\\{dataBlock.Id}_datablock\\Audios";

            string directoryPath = Path.Combine(rootPath, subDirectoryPath);
            string fileType = request.AudioFile.ContentType.Split('/')[1];
            string fileName = $"{Guid.NewGuid()}.{fileType}";
            string filePath = Path.Combine(directoryPath, fileName);

            Directory.CreateDirectory(directoryPath);

            using (var stream = File.OpenWrite(filePath))
            {
                await request.AudioFile.CopyToAsync(stream);
            }

            Audio entity = new Audio()
            {
                Title = request.Title,
                Description = request.Description,
                FilePath = filePath,
                FileType = fileType,
                Privacy = new PrivacyEntity()
                {
                    PrivacyLevel = PrivacyLevel.Confidential,
                    IsAlways = true
                }
            };

            DataBlockAudio dataBlockAudio = new DataBlockAudio()
            {
                DataBlock = dataBlock,
                Audio = entity
            };

            _context.Audios.Add(entity);
            _context.DataBlockAudios.Add(dataBlockAudio);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
