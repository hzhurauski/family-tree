using FamilyTree.Application.PersonContent.DataHolders.Commands;
using FluentValidation;

namespace FamilyTree.Application.PersonContent.DataHolders.Validators
{
    public class UpdateDataHolderOrderCommandValidator : AbstractValidator<UpdateDataHolderOrderCommand>
    {
        public UpdateDataHolderOrderCommandValidator()
        {
            RuleFor(dh => dh.Order)
                .GreaterThan(0);
        }
    }
}
