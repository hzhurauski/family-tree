using FamilyTree.Application.Media.Images.Commands;
using FluentValidation;

namespace FamilyTree.Application.Media.Images.Validators
{
    public class CreateImageCommandValidator : AbstractValidator<CreateImageCommand>
    {
        public CreateImageCommandValidator()
        {
            RuleFor(i => i.Title)
                .NotEmpty();

            RuleFor(i => i.ImageFile)
                .NotEmpty();
        }
    }
}
