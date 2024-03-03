using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.Media.Audios.Queries;
using FamilyTree.Application.Media.Audios.ViewModels;
using FamilyTree.Domain.Entities.PersonContent;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;
using FamilyTree.Application.Media.Participants.Queries;
using Microsoft.EntityFrameworkCore;
using FamilyTree.Application.PersonContent.DataBlocks.ViewModels;
using FamilyTree.Domain.Entities.Tree;
using System.Linq;
using FamilyTree.Domain.Enums.PersonContent;

namespace FamilyTree.Application.Media.Participants.Handlers
{
    public class GetParticipantsQueryHandler : IRequestHandler<GetParticipantsQuery, List<ParticipantVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetParticipantsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ParticipantVM>> Handle(GetParticipantsQuery request, CancellationToken cancellationToken)
        {
            var participants = await _context.PersonToDataBlocks
                .Where(x => x.DataBlockId == request.DataBlockId)
                .ToListAsync();

            var participantProfiles = participants != null && participants.Any()
                    ? await _context.People
                        .AsNoTracking()
                        .Include(x => x.DataCategories)
                            .ThenInclude(x => x.DataBlocks)
                                .ThenInclude(x => x.DataHolders)
                        .Where(x => participants.Select(p => p.PersonId).Contains(x.Id))
                        .ToListAsync()
                    : new List<Person>();

            var dataBlockOwner = await _context.People
                .AsNoTracking()
                .Include(x => x.DataCategories)
                    .ThenInclude(x => x.DataBlocks)
                        .ThenInclude(x => x.DataHolders)
                .SingleOrDefaultAsync(x => x.DataCategories.Any(x => x.DataBlocks.Any(x => x.Id == request.DataBlockId)));

            participantProfiles.Insert(0, dataBlockOwner);

            var dataHoldersByParticipant = participantProfiles.ToDictionary(x => x, x => x.DataCategories
                        ?.FirstOrDefault(dc => dc.DataCategoryType == DataCategoryType.PersonInfo).DataBlocks
                        ?.FirstOrDefault().DataHolders);

            var result = dataHoldersByParticipant.Select(x => new ParticipantVM
            {
                Id = x.Key.Id,
                Name = x.Value
                    .Where(dh => dh.DataHolderType == DataHolderType.Name)
                    .First().Data,
                Surname = x.Value
                    .Where(dh => dh.DataHolderType == DataHolderType.Surname)
                    .First().Data,
                Middlename = x.Value
                    .Where(dh => dh.DataHolderType == DataHolderType.MiddleName)
                    .First().Data,
                Birthday = x.Value
                    .Where(dh => dh.DataHolderType == DataHolderType.Birthday)
                    .First().Data,
                AvatarImageId = x.Key.AvatarImageId,
            }).ToList();

            result[0].IsOwner = true;

            return result;
        }
    }
}
