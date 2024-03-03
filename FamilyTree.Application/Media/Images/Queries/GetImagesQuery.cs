using FamilyTree.Application.Media.Images.ViewModels;
using MediatR;
using System.Collections.Generic;

namespace FamilyTree.Application.Media.Images.Queries
{
    public class GetImagesQuery : IRequest<List<ImageDto>>
    {
        public int DataBlockId { get; set; }

        public string UserId { get; set; }
    }
}
