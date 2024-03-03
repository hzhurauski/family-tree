using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Infrastructure;
using FamilyTree.WebUI.Services;
using FamilyTree.Application;
using System.IO;
using FamilyTree.WebUI.Hubs;
using FamilyTree.Application.Privacy.Interfaces;

namespace FamilyTree.WebUI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddInfrastructure(Configuration);
            services.AddApplication();
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddHostedService<PrivacyNotificationsBackgroundService>();
            services.AddScoped<IPrivacyNotificationsService, PrivacyNotificationsService>();

            services.AddControllersWithViews()
                .AddJsonOptions(options =>
                {
                    // Use the default property (Pascal) casing.
                    options.JsonSerializerOptions.PropertyNamingPolicy = null;
                });

            services.AddSignalR()
                .AddJsonProtocol(configure =>
                {
                    configure.PayloadSerializerOptions.PropertyNamingPolicy = null;
                });

            services.AddRazorPages();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseExceptionHandler("/Error/Index");

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            CheckUploadsFolderPath();
            CheckTempFilesFolderPath();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=FamilyTree}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
                endpoints.MapHub<PrivacyHub>("/Privacy/Notifications");
            });
        }

        private void CheckUploadsFolderPath()
        {
            string dir = Path.Combine(Configuration["FilesStorageFolderPath"],
                Configuration["UploadsFolderPath"]);
            if (!Directory.Exists(dir))
                Directory.CreateDirectory(dir);
        }

        private void CheckTempFilesFolderPath()
        {
            string dir = Path.Combine(Configuration["FilesStorageFolderPath"],
                Configuration["TempFilesFolderPath"]);
            if (!Directory.Exists(dir))
                Directory.CreateDirectory(dir);
        }
    }
}
