using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.Privacy.Interfaces
{
    public interface IPrivacyNotificationsService
    {
        Task NotifyUsersIfPrivacyTimeExpired(CancellationToken cancellationToken = default);
    }
}
