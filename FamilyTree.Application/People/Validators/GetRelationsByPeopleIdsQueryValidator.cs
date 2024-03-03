using FamilyTree.Application.People.Queries;
using FluentValidation;

namespace FamilyTree.Application.People.Validators
{
    public class GetRelationsByPeopleIdsQueryValidator : AbstractValidator<GetRelationsByPeopleIdsQuery>
    {
        public GetRelationsByPeopleIdsQueryValidator()
        {
            RuleFor(q => q.FamilyTreeId)
                .NotEqual(0)
                .NotEmpty();

            RuleFor(q => q.PersonId)
                .NotEqual(0)
                .NotEmpty();

            RuleFor(q => q.TargetPersonId)
                .NotEqual(0)
                .NotEmpty();
        }
    }
}
