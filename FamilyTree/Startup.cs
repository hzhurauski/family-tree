using FamilyTree.Infrastructure.Persistence;
using FamilyTree.Domain.Entities.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Infrastructure;
using FamilyTree.Application;
using FamilyTree.Services;
using FamilyTree.Application.Privacy.Interfaces;
using System.IO;

namespace FamilyTree
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

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            services.AddAuthentication()
                .AddIdentityServerJwt();

            services.AddControllersWithViews();

            services.AddSignalR()
                .AddJsonProtocol(configure =>
                {
                    configure.PayloadSerializerOptions.PropertyNamingPolicy = null;
                });

            services.AddRazorPages();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseHsts();
            }

            app.UseExceptionHandler("/Error/Index");

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();

            CheckUploadsFolderPath();
            CheckTempFilesFolderPath();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
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
