using FamilyTree.Application.PersonContent.DataHolders.Commands;
using FluentValidation;

namespace FamilyTree.Application.PersonContent.DataHolders.Validators
{
    public class UpdateDataHolderTitleCommandValidator : AbstractValidator<UpdateDataHolderTitleCommand>
    {
        public UpdateDataHolderTitleCommandValidator()
        {
            RuleFor(dh => dh.Title)
                .NotEmpty();
        }
    }
}
