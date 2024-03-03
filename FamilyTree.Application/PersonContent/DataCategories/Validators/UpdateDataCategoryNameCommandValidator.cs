using FamilyTree.Application.PersonContent.DataCategories.Commands;
using FluentValidation;

namespace FamilyTree.Application.PersonContent.DataCategories.Validators
{
    public class UpdateDataCategoryNameCommandValidator : AbstractValidator<UpdateDataCategoryNameCommand>
    {
        public UpdateDataCategoryNameCommandValidator()
        {
            RuleFor(dc => dc.Name)
                .NotEmpty();
        }
    }
}
