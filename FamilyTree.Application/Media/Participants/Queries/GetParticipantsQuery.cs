using FamilyTree.Application.Media.Audios.ViewModels;
using FamilyTree.Application.PersonContent.DataBlocks.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace FamilyTree.Application.Media.Participants.Queries
{
    public class GetParticipantsQuery : IRequest<List<ParticipantVM>>
    {
        public int DataBlockId { get; set; }
    }
}
