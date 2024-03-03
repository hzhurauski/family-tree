using FamilyTree.Application.PersonContent.DataCategories.Commands;
using FamilyTree.Domain.Enums.PersonContent;
using System.Collections.Generic;

namespace FamilyTree.Application.PersonContent.DataCategories.Extensions
{
    public static class CreateDataCategoryCommandExtension
    {
        private static List<DataCategoryType> NotAllowedToCreateDataCategoryTypes;

        static CreateDataCategoryCommandExtension()
        {
            NotAllowedToCreateDataCategoryTypes = new List<DataCategoryType>()
            {
                DataCategoryType.Education,
                DataCategoryType.ImportantEvents,
                DataCategoryType.LaborActivities,
                DataCategoryType.PersonInfo,
                DataCategoryType.Residencies
            };
        }

        public static bool CanCreate(this CreateDataCategoryCommand command)
        {
            return !NotAllowedToCreateDataCategoryTypes.Contains(command.DataCategoryType);
        }
    }
}
