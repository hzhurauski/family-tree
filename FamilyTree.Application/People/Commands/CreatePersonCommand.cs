using FamilyTree.Application.People.Enums;
using MediatR;
using System;

namespace FamilyTree.Application.People.Commands
{
    public class CreatePersonCommand : IRequest<int>
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string Middlename { get; set; }

        public DateTime? Birthday { get; set; }

        public GenderType Gender { get; set; }

        public int TreeId { get; set; }

        public int ParentNumber { get; set; }

        public PersonRelationType PersonRelationType { get; set; }

        public int WifeId { get; set; }

        public int MainPersonId { get; set; }

        public string UserId { get; set; }
    }
}
