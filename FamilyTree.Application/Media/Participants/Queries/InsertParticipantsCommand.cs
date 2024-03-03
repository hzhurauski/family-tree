using FamilyTree.Application.PersonContent.DataBlocks.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace FamilyTree.Application.Media.Participants.Queries
{
    public class InsertParticipantsCommand : IRequest
    {
        public int ParticipantId { get; set; }
        public int[] DataBlockIds { get; set; }
    }
}
