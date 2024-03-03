using FamilyTree.Application.Common.Interfaces;

namespace FamilyTree.Test
{
    public class CurrentUserServiceDummy : ICurrentUserService
    {
        public string UserId => "123456789";
    }
}
