using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Images.Queries;
using FamilyTree.Application.Media.Images.ViewModels;
using FamilyTree.Application.Privacy.ViewModels;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Media.Images.Handlers
{
    public class GetImagesQueryHandler : IRequestHandler<GetImagesQuery, List<ImageDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetImagesQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ImageDto>> Handle(GetImagesQuery request, CancellationToken cancellationToken)
        {
            DataBlock dataBlock = await _context.DataBlocks
                .SingleOrDefaultAsync(db => db.CreatedBy.Equals(request.UserId) &&
                                            db.Id == request.DataBlockId, 
                                      cancellationToken);

            if (dataBlock == null)
                throw new NotFoundException(nameof(DataBlock), request.DataBlockId);

            var images = await _context.DataBlockImages
                .Include(dbi => dbi.Image)
                .ThenInclude(i => i.Privacy)
                .Where(dbi => dbi.DataBlockId == dataBlock.Id)
                .Select(dbi => new ImageDto()
                {
                    Id = dbi.ImageId,
                    Title = dbi.Image.Title,
                    Description = dbi.Image.Description,
                    Privacy = new PrivacyEntityDto()
                    {
                        Id = dbi.Image.Privacy.Id,
                        BeginDate = dbi.Image.Privacy.BeginDate,
                        EndDate = dbi.Image.Privacy.EndDate,
                        IsAlways = dbi.Image.Privacy.IsAlways.Value,
                        PrivacyLevel = dbi.Image.Privacy.PrivacyLevel
                    }
                })
                .ToListAsync(cancellationToken);

            return images;
        }
    }
}
