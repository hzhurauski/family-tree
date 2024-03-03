using System;
using System.Collections.Generic;
using System.Text;

namespace FamilyTree.Application.PersonContent.DataBlocks.ViewModels
{
    public class ParticipantVM
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public string Middlename { get; set; }

        public string Birthday { get; set; }

        public int? AvatarImageId { get; set; }

        public bool IsOwner { get; set; }
    }
}
