using FamilyTree.Application.PersonContent.DataHolders.Commands;
using FamilyTree.Domain.Enums.PersonContent;
using System.Collections.Generic;

namespace FamilyTree.Application.PersonContent.DataHolders.Extensions
{
    public static class CreateDataHolderCommandExtension
    {
        private static List<DataHolderType> NotAllowedToCreateDataHolderTypes;

        static CreateDataHolderCommandExtension()
        {
            NotAllowedToCreateDataHolderTypes = new List<DataHolderType>() 
            {
                DataHolderType.Name,
                DataHolderType.Surname,
                DataHolderType.MiddleName,
                DataHolderType.Birthday,
                DataHolderType.Gender
            };
        }

        public static bool CanCreate(this CreateDataHolderCommand command)
        {
            return !NotAllowedToCreateDataHolderTypes.Contains(command.DataHolderType);
        }
    }
}
