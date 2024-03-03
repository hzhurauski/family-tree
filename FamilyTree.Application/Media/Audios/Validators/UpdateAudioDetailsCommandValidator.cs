using FamilyTree.Application.Media.Audios.Commands;
using FluentValidation;

namespace FamilyTree.Application.Media.Audios.Validators
{
    public class UpdateAudioDetailsCommandValidator : AbstractValidator<UpdateAudioDetailsCommand>
    {
        public UpdateAudioDetailsCommandValidator()
        {
            RuleFor(a => a.Title)
                .NotEmpty();
        }
    }
}
