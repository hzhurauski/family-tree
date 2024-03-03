using FamilyTree.Application.FamilyTrees.Commands;
using FluentValidation;

namespace FamilyTree.Application.FamilyTrees.Validators
{
    public class CreateFamilyTreeCommandValidator : AbstractValidator<CreateFamilyTreeCommand>
    {
        public CreateFamilyTreeCommandValidator()
        {
            RuleFor(c => c.Name)
                .NotEmpty();
        }
    }
}
