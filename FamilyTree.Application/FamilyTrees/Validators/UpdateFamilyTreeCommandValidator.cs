using FamilyTree.Application.FamilyTrees.Commands;
using FluentValidation;

namespace FamilyTree.Application.FamilyTrees.Validators
{
    public class UpdateFamilyTreeCommandValidator : AbstractValidator<UpdateFamilyTreeNameCommand>
    {
        public UpdateFamilyTreeCommandValidator()
        {
            RuleFor(c => c.Name)
                .NotEmpty();
        }
    }
}
