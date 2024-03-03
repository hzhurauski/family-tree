using FamilyTree.Application.Media.Audios.Commands;
using FluentValidation;

namespace FamilyTree.Application.Media.Audios.Validators
{
    public class CreateAudioCommandValidator : AbstractValidator<CreateAudioCommand>
    {
        public CreateAudioCommandValidator()
        {
            RuleFor(a => a.Title)
                .NotEmpty();

            RuleFor(a => a.AudioFile)
                .NotEmpty();
        }
    }
}
