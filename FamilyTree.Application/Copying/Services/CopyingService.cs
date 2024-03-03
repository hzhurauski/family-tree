using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Copying.Interfaces;
using FamilyTree.Application.PersonContent.DataCategories.Extensions;
using FamilyTree.Application.PersonContent.DataHolders.Extensions;
using FamilyTree.Domain.Entities.Media;
using FamilyTree.Domain.Entities.PersonContent;
using FamilyTree.Domain.Entities.Privacy;
using FamilyTree.Domain.Entities.Tree;
using FamilyTree.Domain.Enums.PersonContent;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Copying.Services
{
    /// <summary>
    /// ICopyingService implementation.
    /// Copying data to IApplicationDbContext.
    /// </summary>
    public class CopyingService : ICopyingService
    {
        private readonly IApplicationDbContext _context;

        public CopyingService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CopyDataCategoryToPerson(Person person, DataCategory dataCategory, CancellationToken cancellationToken)
        {
            var dataCategoriesCount = await _context.DataCategories
                .CountAsync(dc => dc.PersonId == person.Id,
                            cancellationToken);

            DataCategory entity = new DataCategory()
            {
                Name = dataCategory.Name,
                OrderNumber = dataCategoriesCount + 1,
                Person = person,
                DataBlocks = new List<DataBlock>()
            };

            if (!dataCategory.DataCategoryType.CanCopy())
            {
                if (dataCategory.DataCategoryType == DataCategoryType.PersonInfo)
                    entity.DataCategoryType = DataCategoryType.InfoBlock;
                else
                    entity.DataCategoryType = DataCategoryType.ListBlock;
            }
            else
                entity.DataCategoryType = dataCategory.DataCategoryType;

            _context.DataCategories.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var dataBlocks = dataCategory.DataBlocks
                .OrderBy(db => db.OrderNumber)
                .ToList();

            foreach (var dataBlock in dataBlocks)
            {
                await CopyDataBlockToDataCategory(entity, dataBlock, cancellationToken);
            }
        }

        public async Task CopyDataBlockToDataCategory(DataCategory dataCategory, DataBlock dataBlock, CancellationToken cancellationToken)
        {
            DataBlock entity = new DataBlock()
            {
                DataCategory = dataCategory,
                Title = dataBlock.Title,
                OrderNumber = dataCategory.DataBlocks.Count + 1,
                DataHolders = new List<DataHolder>()
            };

            _context.DataBlocks.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var dataHolders = dataBlock.DataHolders
                .OrderBy(dh => dh.OrderNumber)
                .ToList();

            foreach (var dataHolder in dataHolders)
            {
                await CopyDataHolderToDataBlock(entity, dataHolder, cancellationToken);
            }

            var images = await _context.DataBlockImages
                .Include(dbi => dbi.Image.Privacy)
                .Where(dbi => dbi.DataBlockId == dataBlock.Id)
                .Select(dbi => dbi.Image)
                .ToListAsync(cancellationToken);

            foreach (var image in images)
            {
                await CopyImageToDataBlock(entity, image, cancellationToken);
            }

            var videos = await _context.DataBlockVideos
                .Include(dbv => dbv.Video.Privacy)
                .Where(dbv => dbv.DataBlockId == dataBlock.Id)
                .Select(dbv => dbv.Video)
                .ToListAsync(cancellationToken);

            foreach (var video in videos)
            {
                await CopyVideoToDataBlock(entity, video, cancellationToken);
            }

            var audios = await _context.DataBlockAudios
                .Include(dba => dba.Audio.Privacy)
                .Where(dba => dba.DataBlockId == dataBlock.Id)
                .Select(dba => dba.Audio)
                .ToListAsync(cancellationToken);

            foreach (var audio in audios)
            {
                await CopyAudioToDataBlock(entity, audio, cancellationToken);
            }
        }

        public async Task CopyDataHolderToDataBlock(DataBlock dataBlock, DataHolder dataHolder, CancellationToken cancellationToken)
        {
            DataHolder entity = new DataHolder()
            {
                DataBlock = dataBlock,
                Title = dataHolder.Title,
                Data = dataHolder.Data,
                IsDeletable = true,
                OrderNumber = dataBlock.DataHolders.Count + 1,
                Privacy = new PrivacyEntity()
                {
                    BeginDate = dataHolder.Privacy.BeginDate,
                    EndDate = dataHolder.Privacy.EndDate,
                    IsAlways = dataHolder.Privacy.IsAlways,
                    PrivacyLevel = dataHolder.Privacy.PrivacyLevel
                },
                DataHolderType = dataHolder.DataHolderType.CanCopy() ? 
                    dataHolder.DataHolderType : DataHolderType.Text
            };

            _context.DataHolders.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task CopyImageToDataBlock(DataBlock dataBlock, Image image, CancellationToken cancellationToken)
        {
            Image entity = new Image()
            {
                Title = image.Title,
                Description = image.Description,
                ImageData = image.ImageData,
                ImageType = image.ImageType,
                Privacy = new PrivacyEntity()
                {
                    PrivacyLevel = image.Privacy.PrivacyLevel,
                    BeginDate = image.Privacy.BeginDate,
                    EndDate = image.Privacy.EndDate,
                    IsAlways = image.Privacy.IsAlways
                }
            };

            DataBlockImage dataBlockImage = new DataBlockImage()
            {
                DataBlock = dataBlock,
                Image = entity
            };

            _context.DataBlockImages.Add(dataBlockImage);
            _context.Images.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task CopyVideoToDataBlock(DataBlock dataBlock, Video video, CancellationToken cancellationToken)
        {
            Video entity = new Video
            {
                Title = video.Title,
                Description = video.Description,
                PreviewImageData = video.PreviewImageData,
                PreviewImageType = video.PreviewImageType,
                FilePath = video.FilePath,
                FileType = video.FileType,
                Privacy = new PrivacyEntity()
                {
                    PrivacyLevel = video.Privacy.PrivacyLevel,
                    BeginDate = video.Privacy.BeginDate,
                    EndDate = video.Privacy.EndDate,
                    IsAlways = video.Privacy.IsAlways
                }
            };

            DataBlockVideo dataBlockVideo = new DataBlockVideo
            {
                DataBlock = dataBlock,
                Video = entity
            };

            _context.DataBlockVideos.Add(dataBlockVideo);
            _context.Videos.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task CopyAudioToDataBlock(DataBlock dataBlock, Audio audio, CancellationToken cancellationToken)
        {
            Audio entity = new Audio
            {
                Title = audio.Title,
                Description = audio.Description,
                FilePath = audio.FilePath,
                FileType = audio.FileType,
                Privacy = new PrivacyEntity()
                {
                    PrivacyLevel = audio.Privacy.PrivacyLevel,
                    BeginDate = audio.Privacy.BeginDate,
                    EndDate = audio.Privacy.EndDate,
                    IsAlways = audio.Privacy.IsAlways
                }
            };

            DataBlockAudio dataBlockAudio = new DataBlockAudio
            {
                DataBlock = dataBlock,
                Audio = entity
            };

            _context.DataBlockAudios.Add(dataBlockAudio);
            _context.Audios.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
