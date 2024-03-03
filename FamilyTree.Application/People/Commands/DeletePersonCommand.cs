using MediatR;
namespace FamilyTree.Application.People.Commands
{
    public class DeletePersonCommand : IRequest
    {
        public int Id { get; set; }

        public string UserId { get; set; }
    }
}
