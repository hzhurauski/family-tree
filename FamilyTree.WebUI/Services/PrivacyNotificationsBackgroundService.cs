using FamilyTree.Application.Privacy.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.WebUI.Services
{
    public class PrivacyNotificationsBackgroundService : BackgroundService
    {
        private const int ExecutionDelay = 5000;

        private readonly IServiceProvider _serviceProvider;

        private readonly ILogger<PrivacyNotificationsBackgroundService> _logger;

        public PrivacyNotificationsBackgroundService(IServiceProvider serviceProvider, 
            ILogger<PrivacyNotificationsBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Privacy Notifications Background Service is working.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (IServiceScope scope = _serviceProvider.CreateScope())
                    {
                        IServiceProvider services = scope.ServiceProvider;
                        IPrivacyNotificationsService notificationsService = services
                            .GetRequiredService<IPrivacyNotificationsService>();

                        await notificationsService
                            .NotifyUsersIfPrivacyTimeExpired(stoppingToken);
                    }
                }
                catch(Exception ex)
                {
                    _logger.LogError(ex, "Privacy Notifications Background Service exception.");
                }

                await Task.Delay(ExecutionDelay, stoppingToken);
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Privacy Notifications Background Service is stopping.");

            await base.StopAsync(cancellationToken);
        }
    }
}
