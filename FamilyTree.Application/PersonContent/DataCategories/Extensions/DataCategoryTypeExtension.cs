using FamilyTree.Domain.Enums.PersonContent;
using System.Collections.Generic;

namespace FamilyTree.Application.PersonContent.DataCategories.Extensions
{
    public static class DataCategoryTypeExtension
    {
        private static List<DataCategoryType> CanNotCopyDataCategoryTypes;

        static DataCategoryTypeExtension()
        {
            CanNotCopyDataCategoryTypes = new List<DataCategoryType>()
            {
                DataCategoryType.Education,
                DataCategoryType.ImportantEvents,
                DataCategoryType.LaborActivities,
                DataCategoryType.PersonInfo,
                DataCategoryType.Residencies
            };
        }

        public static bool CanCopy(this DataCategoryType dataCategoryType)
        {
            return !CanNotCopyDataCategoryTypes.Contains(dataCategoryType);
        }
    }
}
