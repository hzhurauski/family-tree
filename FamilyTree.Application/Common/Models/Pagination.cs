using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Application.Common.Models
{
    public class Pagination<T>
    {
        public List<T> Items { get; }

        public int Page { get; }

        public int PageSize { get; }

        public int TotalPages { get; }

        public int ItemsCount { get; }

        public Pagination(List<T> items, int itemsCount, int page, int pageSize)
        {
            Items = items;
            Page = page;
            PageSize = pageSize;
            ItemsCount = itemsCount;
            TotalPages = (int)Math.Ceiling(itemsCount / (double)pageSize);
        }

        public bool HasPreviousPage => Page > 1;

        public bool HasNextPage => Page < TotalPages;

        public static async Task<Pagination<T>> CreateAsync(IQueryable<T> dataSource, int page, int pageSize)
        {
            int count = await dataSource.CountAsync();
            List<T> items = await dataSource
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new Pagination<T>(items, count, page, pageSize);
        }
    }
}