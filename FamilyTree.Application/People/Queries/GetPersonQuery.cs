using FamilyTree.Application.People.ViewModels;
using MediatR;

namespace FamilyTree.Application.People.Queries
{
    public class GetPersonQuery : IRequest<PersonDto>
    {
        public int Id { get; set; }

        public string UserId { get; set; }
    }
}
