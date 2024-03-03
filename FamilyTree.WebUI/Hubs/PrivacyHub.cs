using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace FamilyTree.WebUI.Hubs
{
    public class PrivacyHub : Hub
    {
        public async Task SendPrivacyChangedNotification(int privacyId, string userId)
        {            
            await Clients.User(userId)
                .SendAsync("ReceivePrivacyChangedNotification", privacyId);
        }
    }
}
