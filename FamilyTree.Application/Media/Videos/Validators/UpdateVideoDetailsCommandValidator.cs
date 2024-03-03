using FamilyTree.Application.Media.Videos.Commands;
using FluentValidation;

namespace FamilyTree.Application.Media.Videos.Validators
{
    public class UpdateVideoDetailsCommandValidator : AbstractValidator<UpdateVideoDetailsCommand>
    {
        public UpdateVideoDetailsCommandValidator()
        {
            RuleFor(v => v.Title)
                .NotEmpty();
        }
    }
}
