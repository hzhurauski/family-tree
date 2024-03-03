using FamilyTree.Application.Media.Images.Commands;
using FluentValidation;

namespace FamilyTree.Application.Media.Images.Validators
{
    public class UpdateImageDetailsCommandValidator : AbstractValidator<UpdateImageDetailsCommand>
    {
        public UpdateImageDetailsCommandValidator()
        {
            RuleFor(i => i.Title)
                .NotEmpty();
        }
    }
}
