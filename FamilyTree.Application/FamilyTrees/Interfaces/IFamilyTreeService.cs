using FamilyTree.Application.FamilyTrees.Queries;
using FamilyTree.Application.FamilyTrees.ViewModels;
using FamilyTree.Application.People.Queries;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.FamilyTrees.Interfaces
{
    public interface IFamilyTreeService
    {
        Task<FamilyTreeVm> GetFamilyTreeById(GetFamilyTreeByIdQuery request, CancellationToken cancellationToken);

        Task<BloodTreeVm> GetBloodTreeById(GetBloodTreeByIdQuery request, CancellationToken cancellationToken);

        Task<string> GetRelationsByPeopleIds(GetRelationsByPeopleIdsQuery request, CancellationToken cancellationToken);

        Task<List<int>> GetPeopleDeleteList(int familyTreeId, string userId, int startId, int endId, CancellationToken cancellationToken);
    }
}
