using FamilyTree.Application.Privacy.Commands;
using FluentValidation;

namespace FamilyTree.Application.Privacy.Validators
{
    public class UpdatePrivacyCommandValidator : AbstractValidator<UpdatePrivacyCommand>
    {
        public UpdatePrivacyCommandValidator()
        {
            RuleFor(c => c.PrivacyLevel)
                .NotEmpty();

            RuleFor(c => c.BeginDate)
                .NotEmpty()
                .Must((a, b) => a.EndDate >= b);

            RuleFor(c => c.EndDate)
                .NotEmpty();

            RuleFor(c => c.IsAlways)
                .NotEmpty();
        }
    }
}
