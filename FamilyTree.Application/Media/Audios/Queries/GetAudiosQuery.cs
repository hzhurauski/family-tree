using FamilyTree.Application.Media.Audios.ViewModels;
using MediatR;
using System.Collections.Generic;

namespace FamilyTree.Application.Media.Audios.Queries
{
    public class GetAudiosQuery : IRequest<List<AudioDto>>
    {
        public int DataBlockId { get; set; }

        public string UserId { get; set; }
    }
}
