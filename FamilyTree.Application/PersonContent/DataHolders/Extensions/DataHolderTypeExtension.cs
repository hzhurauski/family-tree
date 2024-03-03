using FamilyTree.Domain.Enums.PersonContent;
using System.Collections.Generic;

namespace FamilyTree.Application.PersonContent.DataHolders.Extensions
{
    public static class DataHolderTypeExtension
    {
        private static List<DataHolderType> CanNotCopyDataHolderTypes;

        static DataHolderTypeExtension()
        {
            CanNotCopyDataHolderTypes = new List<DataHolderType>() 
            {
                DataHolderType.Name,
                DataHolderType.Surname,
                DataHolderType.MiddleName,
                DataHolderType.Birthday,
                DataHolderType.Gender
            };
        }

        public static bool CanCopy(this DataHolderType dataHolderType)
        {
            return !CanNotCopyDataHolderTypes.Contains(dataHolderType);
        }
    }
}
