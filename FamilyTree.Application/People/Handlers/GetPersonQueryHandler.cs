using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.People.Queries;
using FamilyTree.Application.People.ViewModels;
using FamilyTree.Domain.Entities.Tree;
using FamilyTree.Domain.Enums.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.People.Handlers
{
    public class GetPersonQueryHandler : IRequestHandler<GetPersonQuery, PersonDto>
    {
        private readonly IApplicationDbContext _context;

        public GetPersonQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PersonDto> Handle(GetPersonQuery request, CancellationToken cancellationToken)
        {
            Person person = await _context.People
                .Include(p => p.DataCategories)
                .ThenInclude(dc => dc.DataBlocks)
                .ThenInclude(db => db.DataHolders)
                .SingleOrDefaultAsync(p => p.CreatedBy.Equals(request.UserId) &&
                                           p.Id == request.Id, 
                                      cancellationToken);

            if (person == null)
                throw new NotFoundException(nameof(Person), request.Id);

            var dataCategory = person.DataCategories
                .First(dc => dc.DataCategoryType == DataCategoryType.PersonInfo);

            var dataHolders = dataCategory.DataBlocks
                .First()
                .DataHolders;

            PersonDto result = new PersonDto()
            {
                Id = person.Id,
                Name = dataHolders
                    .Where(dh => dh.DataHolderType == DataHolderType.Name)
                    .First().Data,
                Surname = dataHolders
                    .Where(dh => dh.DataHolderType == DataHolderType.Surname)
                    .First().Data,
                Middlename = dataHolders
                    .Where(dh => dh.DataHolderType == DataHolderType.MiddleName)
                    .First().Data,
                AvatarImageId = person.AvatarImageId
            };

            return result;
        }
    }
}
