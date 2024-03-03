using FamilyTree.Application.PersonContent.DataHolders.ViewModels;
using MediatR;

namespace FamilyTree.Application.PersonContent.DataHolders.Queries
{
    public class GetDataHolderQuery : IRequest<DataHolderDto>
    {
        public int Id { get; set; }

        public string UserId { get; set; }
    }
}
