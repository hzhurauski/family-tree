using FamilyTree.Application.Common.Interfaces;
using System;

namespace FamilyTree.Infrastructure.Services
{
    public class DateTimeService : IDateTimeService
    {
        public DateTime Now => DateTime.UtcNow;
    }
}
