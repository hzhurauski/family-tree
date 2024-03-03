using FamilyTree.Application.PersonContent.DataCategories.Commands;
using FluentValidation;

namespace FamilyTree.Application.PersonContent.DataCategories.Validators
{
    public class CreateDataCategoryCommandValidator : AbstractValidator<CreateDataCategoryCommand>
    {
        public CreateDataCategoryCommandValidator()
        {
            RuleFor(c => c.Name)
                .NotEmpty();
        }
    }
}
