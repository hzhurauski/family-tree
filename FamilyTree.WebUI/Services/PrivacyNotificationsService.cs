using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Privacy.Interfaces;
using FamilyTree.Domain.Enums.Privacy;
using FamilyTree.WebUI.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.WebUI.Services
{
    public class PrivacyNotificationsService : IPrivacyNotificationsService
    {
        private readonly IApplicationDbContext _context;

        private readonly IHubContext<PrivacyHub> _privacyHubContext;

        private readonly IDateTimeService _dateTimeService;

        public PrivacyNotificationsService(IApplicationDbContext context, 
            IHubContext<PrivacyHub> privacyHubContext, 
            IDateTimeService dateTimeService)
        {
            _context = context;
            _privacyHubContext = privacyHubContext;
            _dateTimeService = dateTimeService;
        }

        public async Task NotifyUsersIfPrivacyTimeExpired(CancellationToken cancellationToken = default)
        {
            var nowDateTime = _dateTimeService.Now;
            var privacies = await _context.Privacies
                .Where(dhp => !dhp.IsAlways.Value &&
                              nowDateTime > dhp.EndDate)
                .ToListAsync(cancellationToken);

            if (privacies.Count == 0)
                return;

            privacies.ForEach(item => 
            {
                item.IsAlways = true;
                item.PrivacyLevel = PrivacyLevel.PublicUse;
            });

            await _context.SaveChangesAsync(cancellationToken);

            privacies.ForEach(item =>
            {
                _privacyHubContext.Clients
                    .User(item.CreatedBy)
                    .SendAsync("ReceivePrivacyChangedNotification", item.Id);
            });
        }
    }
}
