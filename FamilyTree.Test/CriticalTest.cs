using FamilyTree.Application;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataBlocks.ViewModels;
using FamilyTree.Application.PersonContent.DataCategories.Commands;
using FamilyTree.Application.PersonContent.DataCategories.Queries;
using FamilyTree.Application.PersonContent.DataCategories.ViewModels;
using FamilyTree.Application.PersonContent.DataHolders.ViewModels;
using FamilyTree.Application.Privacy.ViewModels;
using FamilyTree.Domain.Entities.Identity;
using FamilyTree.Domain.Entities.PersonContent;
using FamilyTree.Domain.Enums.PersonContent;
using FamilyTree.Domain.Enums.Privacy;
using FamilyTree.Infrastructure.Persistence;
using FamilyTree.Infrastructure.Services;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Test
{
    [TestClass]
    public class CriticalTest
    {
        private readonly IServiceProvider _serviceProvider;

        public CriticalTest()
        {
            _serviceProvider = CreateServiceProvider();
        }

        [TestMethod]
        public async Task GetDataCategoryQueryHandlerTest()
        {
            int dataCategoryId = 61;
            string userId = "e57c56b8-9fe2-4a64-8b3f-b4c90174b2b1";

            var query = new GetDataCategoryQuery()
            {
                DataCategoryId = dataCategoryId,
                UserId = userId
            };

            int expected = 61;              
            int actual = 0;

            using (var scope = _serviceProvider.CreateScope())
            {
                var sender = scope.ServiceProvider.GetRequiredService<ISender>();
                var result = await sender.Send(query);

                actual = result.Id;
            }

            Assert.AreEqual(expected, actual);
        }

        [TestMethod]
        public async Task DeleteDataCategoryCommandHandlerTest()
        {
            int dataCategoryId = 76;
            int personId = 13;
            string userId = "e57c56b8-9fe2-4a64-8b3f-b4c90174b2b1";

            var command = new DeleteDataCategoryCommand()
            {
                Id = dataCategoryId,
                UserId = userId
            };

            int[] expected = { 61, 62, 63, 64, 65, 77, 78 };
            int[] actual = null;

            using (var scope = _serviceProvider.CreateScope())
            {
                var sender = scope.ServiceProvider.GetRequiredService<ISender>();
                var result = await sender.Send(command);

                var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

                actual = context.DataCategories
                    .Where(dc => dc.PersonId == personId)
                    .OrderBy(dc => dc.OrderNumber)
                    .Select(dc => dc.Id)
                    .ToArray();
            }

            CollectionAssert.AreEqual(expected, actual);
        }

        [TestMethod]
        public async Task UpdateDataCategoryOrderCommandHandlerTest()
        {
            int dataCategoryId = 63;
            int personId = 13;
            string userId = "e57c56b8-9fe2-4a64-8b3f-b4c90174b2b1";

            var command = new UpdateDataCategoryOrderCommand()
            {
                Id = dataCategoryId,
                Order = 6,
                UserId = userId
            };

            int[] expected = { 61, 62, 64, 65, 77, 63, 78 };
            int[] actual = null;

            using (var scope = _serviceProvider.CreateScope())
            {
                var sender = scope.ServiceProvider.GetRequiredService<ISender>();
                var result = await sender.Send(command);

                var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

                actual = context.DataCategories
                    .Where(dc => dc.PersonId == personId)
                    .OrderBy(dc => dc.OrderNumber)
                    .Select(dc => dc.Id)
                    .ToArray();
            }

            CollectionAssert.AreEqual(expected, actual);
        }

        private IServiceProvider CreateServiceProvider()
        {
            IServiceCollection services = new ServiceCollection();

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer("Server=(LocalDB)\\MSSQLLocalDB;Database=FamilyTreeDb;Trusted_Connection=True;MultipleActiveResultSets=True"));

            services.AddScoped<IApplicationDbContext>(services => services.GetService<ApplicationDbContext>());

            services.AddTransient<IDateTimeService, DateTimeService>();

            services.AddApplication();

            services.AddScoped<ICurrentUserService, CurrentUserServiceDummy>();

            return services.BuildServiceProvider();
        }
    }
}
