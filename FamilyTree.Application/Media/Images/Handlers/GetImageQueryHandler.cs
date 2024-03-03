using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Images.Queries;
using FamilyTree.Application.Media.Images.ViewModels;
using FamilyTree.Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Media.Images.Handlers
{
    public class GetImageQueryHandler : IRequestHandler<GetImageQuery, ImageVm>
    {
        private readonly IApplicationDbContext _context;

        public GetImageQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ImageVm> Handle(GetImageQuery request, CancellationToken cancellationToken)
        {
            Image image = await _context.Images
                .SingleOrDefaultAsync(i => i.CreatedBy.Equals(request.UserId) &&
                                           i.Id == request.Id, 
                                      cancellationToken);

            if (image == null)
                throw new NotFoundException(nameof(Image), request.Id);

            ImageVm result = new ImageVm()
            {
                ImageData = image.ImageData,
                ImageType = image.ImageType
            };

            return result;
        }
    }
}
