using FamilyTree.Application.PersonContent.DataBlocks.Commands;
using FluentValidation;

namespace FamilyTree.Application.PersonContent.DataBlocks.Validators
{
    public class UpdateDataBlockTitleCommandValidator : AbstractValidator<UpdateDataBlockTitleCommand>
    {
        public UpdateDataBlockTitleCommandValidator()
        {
            RuleFor(db => db.Title)
                .NotEmpty();
        }
    }
}
