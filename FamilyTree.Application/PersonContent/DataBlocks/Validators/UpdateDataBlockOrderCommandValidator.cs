using FamilyTree.Application.PersonContent.DataBlocks.Commands;
using FluentValidation;

namespace FamilyTree.Application.PersonContent.DataBlocks.Validators
{
    public class UpdateDataBlockOrderCommandValidator : AbstractValidator<UpdateDataBlockOrderCommand>
    {
        public UpdateDataBlockOrderCommandValidator()
        {
            RuleFor(db => db.Order)
                .GreaterThan(0);
        }
    }
}
