using MediatR;
using System.Collections.Generic;

namespace FamilyTree.Application.Copying.Commands
{
    public class CopyDataCategoriesCommand : IRequest
    {
        public List<int> DataCategoriesIds { get; set; }

        public int PersonId { get; set; }

        public string UserId { get; set; }
    }
}
