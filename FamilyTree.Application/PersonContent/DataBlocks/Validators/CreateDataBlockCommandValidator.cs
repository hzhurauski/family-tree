using FamilyTree.Application.PersonContent.DataBlocks.Commands;
using FluentValidation;

namespace FamilyTree.Application.PersonContent.DataBlocks.Validators
{
    public class CreateDataBlockCommandValidator : AbstractValidator<CreateDataBlockCommand>
    {
        public CreateDataBlockCommandValidator()
        {
            RuleFor(c => c.Title)
                .NotEmpty();
        }
    }
}
