using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.FamilyTrees.Interfaces;
using FamilyTree.Application.People.Commands;
using FamilyTree.Domain.Entities.Tree;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.People.Handlers
{
    public class DeletePersonCommandHandler : IRequestHandler<DeletePersonCommand>
    {
        private readonly IApplicationDbContext _context;

        private readonly IFamilyTreeService _familyTreeService;

        public DeletePersonCommandHandler(IApplicationDbContext context, 
            IFamilyTreeService familyTreeService)
        {
            _context = context;
            _familyTreeService = familyTreeService;
        }

        public async Task<Unit> Handle(DeletePersonCommand request, CancellationToken cancellationToken)
        {
            Person person = await _context.People
                .Include(p => p.FamilyTree)
                .SingleOrDefaultAsync(p => p.CreatedBy.Equals(request.UserId) &&
                                           p.Id == request.Id,
                                      cancellationToken);

            if (person == null)
                throw new NotFoundException(nameof(Person), request.Id);

            bool isMainPerson = false;
            int familyTreeId = person.FamilyTreeId;

            if (person.FamilyTree.MainPersonId == person.Id)
                isMainPerson = true;

            // Получение id первого челокека, который был создан в дереве
            // и является корнем дерева относительно данной системы
            int idMainPersonTree = person.FamilyTree.MainPersonId.Value;

            // Получение части дерева, которое будет удалено
            List<int> deleteLine = await _familyTreeService
                .GetPeopleDeleteList(familyTreeId, request.UserId, idMainPersonTree, person.Id, cancellationToken);

            int valDel = 0;
            for (int i = 0; i < deleteLine.Count; i++)
            {
                valDel = deleteLine[i];

                // Удаление всех уз и корректировка данных                    
                _context.FamilyTies.RemoveRange(_context.FamilyTies.Where(p => p.PersonId == valDel));
                List<int> ftList = _context.FamilyTies.Where(p => p.Parent1Id == valDel).Select(p => p.Id).ToList();
                List<int> ftList2 = _context.FamilyTies.Where(p => p.Parent2Id == valDel).Select(p => p.Id).ToList();
                List<int> ftList3 = _context.FamilyTies.Where(p => p.MarriagePersonId == valDel).Select(p => p.Id).ToList();
                List<int> ftList4 = _context.FamilyTies.Where(p => p.ChildId == valDel).Select(p => p.Id).ToList();

                if (ftList != null && ftList.Count > 0)
                {
                    for (int k = 0; k < ftList.Count; k++)
                    {
                        int id = ftList[k];
                        FamilyTie ft1 = _context.FamilyTies.First(p => p.Id == id);
                        ft1.Parent1Id = null;
                        await _context.SaveChangesAsync(cancellationToken);
                    }

                    await _context.SaveChangesAsync(cancellationToken);
                }
                if (ftList2 != null && ftList2.Count > 0)
                {
                    for (int k = 0; k < ftList2.Count; k++)
                    {
                        int id = ftList2[k];
                        FamilyTie ft2 = _context.FamilyTies.First(p => p.Id == id);
                        ft2.Parent2Id = null;
                        await _context.SaveChangesAsync(cancellationToken);
                    }

                    await _context.SaveChangesAsync(cancellationToken);
                }
                if (ftList3 != null && ftList3.Count > 0)
                {
                    for (int k = 0; k < ftList3.Count; k++)
                    {
                        int id = ftList3[k];
                        FamilyTie ft3 = _context.FamilyTies.First(p => p.Id == id);
                        ft3.MarriagePersonId = null;
                        await _context.SaveChangesAsync(cancellationToken);
                    }

                    await _context.SaveChangesAsync(cancellationToken);
                }
                if (ftList4 != null && ftList4.Count > 0)
                {
                    int val = ftList4[0];
                    FamilyTie ftchild = _context.FamilyTies.First(p => p.Id == val);
                    List<int> ftListBro = _context.FamilyTies
                        .Where(p => p.Parent1Id == ftchild.Parent1Id && 
                                    p.Parent2Id == ftchild.Parent2Id)
                        .Select(p => p.PersonId)
                        .ToList();

                    ftListBro.Remove(ftchild.PersonId);

                    if (ftListBro.Count > 0)
                    {
                        for (int k = 0; k < ftList4.Count; k++)
                        {
                            int id = ftList4[k];
                            _context.FamilyTies.Remove(_context.FamilyTies.First(p => p.Id == id));
                            await _context.SaveChangesAsync(cancellationToken);
                        }
                    }
                    else
                    {
                        for (int k = 0; k < ftList4.Count; k++)
                        {
                            int id = ftList4[k];
                            FamilyTie ft4 = _context.FamilyTies.First(p => p.Id == id);
                            ft4.ChildId = null;
                            await _context.SaveChangesAsync(cancellationToken);
                        }
                    }


                    await _context.SaveChangesAsync(cancellationToken);
                }

                _context.People.Remove(_context.People.First(p => p.Id == valDel));

                await _context.SaveChangesAsync(cancellationToken);
            }

            if (isMainPerson)
            {
                var familyTree = await _context.FamilyTrees
                    .Include(ft => ft.People)
                    .SingleOrDefaultAsync(ft => ft.Id == familyTreeId,
                                          cancellationToken);

                familyTree.MainPersonId = familyTree.People
                    .FirstOrDefault()?.Id;
            }

            // Сохранение результатов
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
