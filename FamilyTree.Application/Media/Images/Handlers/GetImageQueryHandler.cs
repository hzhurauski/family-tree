using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Images.Queries;
using FamilyTree.Application.Media.Images.ViewModels;
using FamilyTree.Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
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
            var userId = request.UserId;
            /*var sharedTree = await _context.FamilyTrees
                .Join(_context.SharedTrees, ft => ft.Id, st => st.FamilyTreeId, (ft, st) => new
                {
                    FamilyTree = ft,
                    SharedTree = st
                })
                .Where(jn => (jn.FamilyTree.UserId.Equals(userId) || jn.SharedTree.SharedPersonId.Equals(userId) && jn.FamilyTree.Id == treeId))
                .Select(jn => new
                {
                    Id = jn.FamilyTree.Id,
                    Name = jn.FamilyTree.Name,
                    MainPersonId = jn.FamilyTree.MainPersonId,
                    UserId = jn.FamilyTree.UserId
                })
                .SingleOrDefaultAsync(cancellationToken);

            if (sharedTree != null)
            {
                userId = sharedTree.UserId;
            }
            */
            Image image = await _context.Images
                .SingleOrDefaultAsync(i => i.CreatedBy.Equals(userId) &&
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
