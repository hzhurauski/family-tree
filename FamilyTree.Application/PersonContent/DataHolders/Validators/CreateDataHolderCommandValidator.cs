using FamilyTree.Application.PersonContent.DataHolders.Commands;
using FluentValidation;

namespace FamilyTree.Application.PersonContent.DataHolders.Validators
{
    public class CreateDataHolderCommandValidator : AbstractValidator<CreateDataHolderCommand>
    {
        public CreateDataHolderCommandValidator()
        {
            RuleFor(c => c.Title)
                .NotEmpty();
        }
    }
}
