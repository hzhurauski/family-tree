using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Infrastructure.Services;
using FamilyTree.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using FamilyTree.Domain.Entities.Identity;

namespace FamilyTree.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("ApplicationDbConnection")));

            services.AddScoped<IApplicationDbContext>(services => services.GetService<ApplicationDbContext>());

            services.AddDefaultIdentity<ApplicationUser>(options =>
            {
                options.Password = new PasswordOptions()
                {
                    RequireDigit = false,
                    RequireNonAlphanumeric = false,
                    RequireUppercase = false,
                    RequireLowercase = false
                };
            }
            )
            .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddTransient<IDateTimeService, DateTimeService>();

            return services;
        }
    }
}
