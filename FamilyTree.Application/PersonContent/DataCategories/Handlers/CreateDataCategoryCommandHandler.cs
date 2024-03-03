using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataCategories.Commands;
using FamilyTree.Application.PersonContent.DataCategories.Extensions;
using FamilyTree.Domain.Entities.PersonContent;
using FamilyTree.Domain.Entities.Tree;
using FamilyTree.Domain.Enums.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataCategories.Handlers
{
    public class CreateDataCategoryCommandHandler : IRequestHandler<CreateDataCategoryCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateDataCategoryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateDataCategoryCommand request, CancellationToken cancellationToken)
        {
            Person person = await _context.People
                .SingleOrDefaultAsync(p => p.CreatedBy.Equals(request.UserId) &&
                                           p.Id == request.PersonId,
                                      cancellationToken);

            if (person == null)
                throw new NotFoundException(nameof(Person), request.PersonId);

            if (!request.CanCreate())
                throw new ArgumentException(
                    $"Category with CategoryType = \"{request.DataCategoryType}\" is not allowed to create.",
                    nameof(request.DataCategoryType));

            var dataCategories = await _context.DataCategories
                .Where(dc => dc.PersonId == person.Id)
                .ToListAsync(cancellationToken);

            DataCategory entity = new DataCategory();
            entity.DataCategoryType = request.DataCategoryType;
            entity.PersonId = person.Id;
            entity.Name = request.Name;
            entity.OrderNumber = dataCategories.Count() + 1;

            if (request.DataCategoryType == DataCategoryType.InfoBlock)
            {
                entity.DataBlocks = new List<DataBlock>() 
                { 
                    new DataBlock() { Title = string.Empty }
                };
            }

            _context.DataCategories.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
