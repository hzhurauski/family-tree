using FamilyTree.Application.FamilyTrees.ViewModels;
using MediatR;
using System.Collections.Generic;

namespace FamilyTree.Application.FamilyTrees.Queries
{
    public class GetFamilyTreesQuery : IRequest<List<FamilyTreeEntityDto>>
    {
        public string UserId { get; set; }
    }
}
