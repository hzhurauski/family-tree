using FamilyTree.Application.Media.Videos.Commands;
using FluentValidation;

namespace FamilyTree.Application.Media.Videos.Validators
{
    public class CreateVideoCommandValidator : AbstractValidator<CreateVideoCommand>
    {
        public CreateVideoCommandValidator()
        {
            RuleFor(v => v.Title)
                .NotEmpty();

            RuleFor(v => v.VideoFile)
                .NotEmpty();
        }
    }
}
