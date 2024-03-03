using FamilyTree.Application.PersonContent.DataCategories.Commands;
using FluentValidation;

namespace FamilyTree.Application.PersonContent.DataCategories.Validators
{
    public class UpdateDataCategoryOrderCommandValidator : AbstractValidator<UpdateDataCategoryOrderCommand>
    {
        public UpdateDataCategoryOrderCommandValidator()
        {
            RuleFor(dc => dc.Order)
                .GreaterThan(0);
        }
    }
}
