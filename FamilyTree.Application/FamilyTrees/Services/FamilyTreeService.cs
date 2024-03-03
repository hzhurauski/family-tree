using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.FamilyTrees.Queries;
using FamilyTree.Application.FamilyTrees.ViewModels;
using FamilyTree.Application.People.Queries;
using FamilyTree.Application.People.ViewModels;
using FamilyTree.Domain.Entities.Tree;
using FamilyTree.Domain.Entities.PersonContent;
using FamilyTree.Domain.Enums.PersonContent;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FamilyTree.Application.FamilyTrees.Interfaces;

namespace FamilyTree.Application.FamilyTrees.Services
{
    public class FamilyTreeService : IFamilyTreeService
    {
        private class PersonNode
        {
            public int Id_person { get; set; }
            public int? Parent_1 { get; set; }
            public int? Parent_2 { get; set; }
            public List<WifeChildren> WifeChildren { get; set; }

            public string Gender { get; set; }

            public PersonNode()
            {
                Id_person = 0;
                Parent_1 = null;
                Parent_2 = null;
                WifeChildren = new List<WifeChildren>();
            }
        }

        private struct WifeChildren
        {
            public int? Wife { get; set; }
            public List<int?> Children { get; set; }
        }

        private readonly IApplicationDbContext _context;

        private List<PersonNode> People { get; set; } // Данные о людях в форме узлов дерева

        private bool FindPerson; // флаг на завершение рекурсивных вызовов

        private List<int> Line; // Результат рекурсивного поиска отношения между двумя id

        private int errorRecursive; // счетчик на ошибку рекурсии

        public FamilyTreeService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> GetRelationsByPeopleIds(GetRelationsByPeopleIdsQuery request, CancellationToken cancellationToken)
        {
            await LoadPeople(request.FamilyTreeId.Value, request.UserId, cancellationToken);

            return await FindRelation(request.TargetPersonId.Value, request.PersonId.Value, cancellationToken);
        }
        /* // Дополнение: Функция получения лет жизни человека.
        public async Task<string> GetLifeYearsPeopleId(GetLifeYearsByPeopleIdQuery request, CancellationToken cancellationToken)
        {
            //await LoadPeople(request.FamilyTreeId.Value, request.UserId, cancellationToken);

            return await FindLifeYears(request.PersonId.Value, cancellationToken);
        }
        */ // Дополнение: Функция получения лет жизни человека.
        public async Task<BloodTreeVm> GetBloodTreeById(GetBloodTreeByIdQuery request, CancellationToken cancellationToken)
        {
            FamilyTreeVm tree = await GetFamilyTreeById(new GetFamilyTreeByIdQuery()
            {
                UserId = request.UserId,
                WifeId = request.WifeId,
                FamilyTreeId = request.FamilyTreeId,
                PersonId = request.CurrentMainId
            }, cancellationToken);

            await LoadPeople(request.FamilyTreeId, request.UserId, cancellationToken);

            BloodTreeVm bloodTree = new BloodTreeVm();

            PersonDto[] grand = new PersonDto[8];
            grand[0] = tree.Grand_1_1;
            grand[1] = tree.Grand_1_2;
            grand[2] = tree.Grand_2_1;
            grand[3] = tree.Grand_2_2;
            grand[4] = tree.Grand_W_1_1;
            grand[5] = tree.Grand_W_1_2;
            grand[6] = tree.Grand_W_2_1;
            grand[7] = tree.Grand_W_2_2;

            PersonDto[] parent = new PersonDto[4];
            parent[0] = tree.Parent_1;
            parent[1] = tree.Parent_2;
            parent[2] = tree.Parent_W_1;
            parent[3] = tree.Parent_W_2;

            bloodTree.Grand = CheckListOnBloodRelation(grand.ToList(), request.BloodMainId);
            bloodTree.Parent = CheckListOnBloodRelation(parent.ToList(), request.BloodMainId);
            bloodTree.Brothers = CheckListOnBloodRelation(tree.Brothers, request.BloodMainId);
            bloodTree.Wifes = CheckListOnBloodRelation(tree.Wifes, request.BloodMainId);
            bloodTree.Children = CheckListOnBloodRelation(tree.Children, request.BloodMainId);
            bloodTree.Main = CheckBloodRelation(request.BloodMainId, tree.MainPerson);
            bloodTree.AnotherChild = CheckBloodRelation(request.BloodMainId, tree.ChildWife_2);

            return bloodTree;
        }

        public async Task<FamilyTreeVm> GetFamilyTreeById(GetFamilyTreeByIdQuery request, CancellationToken cancellationToken)
        {
            FamilyTreeVm result = new FamilyTreeVm();

            result.MainPerson = await GetPerson(request.FamilyTreeId, request.PersonId, request.UserId, cancellationToken);

            if (result.MainPerson == null)
                throw new NotFoundException(nameof(Person), request.PersonId);

            // Родители
            PersonDto[] personParent = await GetParent(request.FamilyTreeId, request.PersonId, request.UserId, cancellationToken);
            result.Parent_1 = personParent[0];
            result.Parent_2 = personParent[1];

            // Родители родителя 1
            if (result.Parent_1 != null)
            {
                PersonDto[] personGrand = await GetParent(request.FamilyTreeId, result.Parent_1.Id, request.UserId, cancellationToken);
                result.Grand_1_1 = personGrand[0];
                result.Grand_1_2 = personGrand[1];
            }

            // Родители родителя 2
            if (result.Parent_2 != null)
            {
                PersonDto[] personGrand = await GetParent(request.FamilyTreeId, result.Parent_2.Id, request.UserId, cancellationToken);
                result.Grand_2_1 = personGrand[0];
                result.Grand_2_2 = personGrand[1];
            }

            // Родные братья и сестры
            if (result.Parent_1 != null || result.Parent_2 != null)
            {
                if (result.Parent_1 == null && result.Parent_2 != null)
                {
                    result.Brothers = await GetBrothers(request.FamilyTreeId, null, result.Parent_2.Id, request.UserId, cancellationToken);
                }
                else
                {
                    if (result.Parent_1 != null && result.Parent_2 == null)
                    {
                        result.Brothers = await GetBrothers(request.FamilyTreeId, result.Parent_1.Id, null, request.UserId, cancellationToken);
                    }
                    else
                    {
                        result.Brothers = await GetBrothers(request.FamilyTreeId, result.Parent_1.Id, result.Parent_2.Id, request.UserId, cancellationToken);
                    }
                }

                result.Brothers.RemoveAll(p => p.Id == result.MainPerson.Id);
            }


            // Жены
            result.Wifes = await GetWifes(request.FamilyTreeId, request.PersonId, request.UserId, cancellationToken);

            if (result.Wifes != null)
            {
                // Если задан id жены, то сместить список жен
                if (request.WifeId != 0)
                {
                    result.Wifes = ShiftWifes(result.Wifes, request.WifeId);
                }

                // Родители жены 1
                PersonDto[] wifeParent = await GetParent(request.FamilyTreeId, result.Wifes[0].Id, request.UserId, cancellationToken);
                result.Parent_W_1 = wifeParent[0];
                result.Parent_W_2 = wifeParent[1];

                // Родители родителя жены 1
                if (result.Parent_W_1 != null)
                {
                    PersonDto[] wifeGrand = await GetParent(request.FamilyTreeId, result.Parent_W_1.Id, request.UserId, cancellationToken);
                    result.Grand_W_1_1 = wifeGrand[0];
                    result.Grand_W_1_2 = wifeGrand[1];
                }

                // Родители родителя жены 2
                if (result.Parent_W_2 != null)
                {
                    PersonDto[] wifeGrand = await GetParent(request.FamilyTreeId, result.Parent_W_2.Id, request.UserId, cancellationToken);
                    result.Grand_W_2_1 = wifeGrand[0];
                    result.Grand_W_2_2 = wifeGrand[1];
                }

                // Дети жены 1
                result.Children = await GetChildren(request.FamilyTreeId, request.PersonId, result.Wifes[0].Id, request.UserId, cancellationToken);

                // Ребенок жены 2
                if (result.Wifes.Count > 1)
                {
                    List<PersonDto> childs = await GetChildren(request.FamilyTreeId, request.PersonId, result.Wifes[1].Id, request.UserId, cancellationToken);
                    if (childs != null)
                    {
                        result.ChildWife_2 = childs[0];
                    }
                }
            }
            else
            {
                // Дети главной персоны
                result.Children = await GetChildren(request.FamilyTreeId, request.PersonId, 0, request.UserId, cancellationToken);
            }

            // Проверки

            // Проверка у каждого из дедушек и бабушек на наличие родителей
            // и проверка у каждого из дедушек и бабушек на наличие детей от другого брака
            PersonDto[] grand = new PersonDto[8];
            grand[0] = result.Grand_1_1;
            grand[1] = result.Grand_1_2;
            grand[2] = result.Grand_2_1;
            grand[3] = result.Grand_2_2;
            grand[4] = result.Grand_W_1_1;
            grand[5] = result.Grand_W_1_2;
            grand[6] = result.Grand_W_2_1;
            grand[7] = result.Grand_W_2_2;

            result.Grand_has_parent = new bool[8];
            result.Grand_has_another_child = new bool[8];

            for (int i = 0; i < grand.Length; i++)
            {
                if (grand[i] != null)
                {
                    result.Grand_has_parent[i] = await HaveParent(request.FamilyTreeId, grand[i].Id, request.UserId, cancellationToken);
                    result.Grand_has_another_child[i] = await HaveAnotherChild(request.FamilyTreeId, grand[i].Id, request.UserId, cancellationToken);
                }
            }

            // Проверка у каждого из родителей и родителей жены на наличие братьев
            // и проверка у каждого из родителей и родителей жены на наличие детей от другого брака
            PersonDto[] parent = new PersonDto[4];
            parent[0] = result.Parent_1;
            parent[1] = result.Parent_2;
            parent[2] = result.Parent_W_1;
            parent[3] = result.Parent_W_2;

            result.Parent_has_brother = new bool[4];
            result.Parent_has_another_child = new bool[4];

            for (int i = 0; i < parent.Length; i++)
            {
                if (parent[i] != null)
                {
                    if (grand[i * 2] != null && grand[i * 2 + 1] != null)
                    {
                        int brothersCount = await CountBrothers(request.FamilyTreeId, parent[i].Id, grand[i * 2].Id, grand[i * 2 + 1].Id, request.UserId, cancellationToken);
                        if (brothersCount > 0)
                        {
                            result.Parent_has_brother[i] = true;
                        }
                    }

                    result.Parent_has_another_child[i] = await HaveAnotherChild(request.FamilyTreeId, parent[i].Id, request.UserId, cancellationToken);
                }
            }

            // Проверка наличия братьев, а также детей от другого брака у первой жены
            if (result.Wifes != null)
            {
                if (result.Parent_W_1 != null && result.Parent_W_2 != null)
                {
                    int brothersCount = await CountBrothers(request.FamilyTreeId, result.Wifes[0].Id, result.Parent_W_1.Id, result.Parent_W_2.Id, request.UserId, cancellationToken);
                    if (brothersCount > 0)
                    {
                        result.WifeBrother = true;
                    }
                }
            }

            // Проверить наличие родителей у 2-ой жены
            if (result.Wifes != null && result.Wifes.Count > 1)
            {
                result.Wife_2_has_parent = await HaveParent(request.FamilyTreeId, result.Wifes[1].Id, request.UserId, cancellationToken);
            }

            // Проверить наличие у братьев детей
            if (result.Brothers != null)
            {
                result.BrothersSons = new bool[result.Brothers.Count];
                for (int i = 0; i < result.Brothers.Count; i++)
                {
                    result.BrothersSons[i] = await HaveChildren(result.Brothers[i].Id, cancellationToken);
                }
            }

            // Проверить наличие детей от третьего брака
            if (result.Wifes != null && result.Wifes.Count > 2)
            {
                result.Child_Wife_3 = await CountChildren(request.FamilyTreeId, request.PersonId, result.Wifes[2].Id, request.UserId, cancellationToken) > 0 ? true : false;
            }

            // Проверить наличие детей от другого брака у жен 1 и 2
            if (result.Wifes != null)
            {
                result.Wife_has_another_child = result.Wifes.Count > 1 ? new bool[2] : new bool[1];
                for (int i = 0; i < result.Wife_has_another_child.Length; i++)
                {
                    result.Wife_has_another_child[i] = await HaveAnotherChild(request.FamilyTreeId, result.Wifes[i].Id, request.UserId, cancellationToken);
                }
            }

            // Проверить количество детей от первого брака больше 3
            if (result.Wifes != null)
            {
                result.Child_Wife_3 = await CountChildren(request.FamilyTreeId, request.PersonId, result.Wifes[0].Id, request.UserId, cancellationToken) > 3 ? true : false;
            }

            // Проверить количество детей от второго брака больше 1
            if (result.Wifes != null && result.Wifes.Count > 1)
            {
                result.CountChildrenWife_2 = await CountChildren(request.FamilyTreeId, request.PersonId, result.Wifes[1].Id, request.UserId, cancellationToken) > 1 ? true : false;
            }

            // Проверить есть ли у детей дети
            if (result.Children != null)
            {
                result.Child_has_sons = new bool[result.Children.Count];
                for (int i = 0; i < result.Children.Count; i++)
                {
                    result.Child_has_sons[i] = await HaveChildren(result.Children[i].Id, cancellationToken);
                }
            }

            // Проверить есть ли дети у ребенка от второго брака
            if (result.ChildWife_2 != null)
            {
                result.Child_Another_has_sons = await HaveChildren(result.ChildWife_2.Id, cancellationToken);
            }

            return result;
        }

        public async Task<List<int>> GetPeopleDeleteList(int familyTreeId, string userId, int startId, int endId, CancellationToken cancellationToken)
        {
            await LoadPeople(familyTreeId, userId, cancellationToken);

            List<int> deleteList = new List<int>();
            PersonNode pn = People.First(p => p.Id_person == endId);
            deleteList.Add(endId);
            // Получение лини связи между корнем и удаляемым узлом
            List<int> numberLine = FindRelationLine(startId, endId);

            List<int> possibleWays = GetPossibleWays(pn, deleteList);
            List<int> closedWays = new List<int>();

            // Если удаляется не корень
            if (startId != endId)
            {
                // Поиск путей, к которым доступ запрещен для поиска удаления вершин
                for (int i = 0; i < possibleWays.Count; i++)
                {
                    List<int> possLine = FindRelationLine(startId, possibleWays[i]);
                    if (!possLine.Contains(endId))
                    {
                        closedWays.Add(possibleWays[i]);
                    }
                }

                for (int i = 0; i < closedWays.Count; i++)
                {
                    if (pn.WifeChildren.Where(p => p.Wife == closedWays[i]).ToList() != null)
                    {
                        pn.WifeChildren.RemoveAll(p => p.Wife == closedWays[i]);
                    }
                }

                deleteList.AddRange(closedWays);
            }

            errorRecursive = 0;

            FindPartTree(pn, deleteList);

            deleteList = deleteList.Distinct().ToList();

            // Удаление путей с запрещенным доступом
            for (int i = 0; i < closedWays.Count; i++)
            {
                deleteList.Remove(closedWays[i]);
            }

            return deleteList;
        }

        private async Task<PersonDto[]> GetParent(int treeId, int personId, string userId, CancellationToken cancellationToken)
        {
            PersonDto[] result = new PersonDto[2];
            FamilyTie parentTie = await _context.FamilyTies
                .FirstAsync(ft => ft.PersonId == personId, cancellationToken);

            if (parentTie.Parent1Id != null)
            {
                result[0] = await GetPerson(treeId, parentTie.Parent1Id.Value, userId, cancellationToken);
            }

            if (parentTie.Parent2Id != null)
            {
                result[1] = await GetPerson(treeId, parentTie.Parent2Id.Value, userId, cancellationToken); ;
            }

            return result;
        }

        private async Task<List<PersonDto>> GetBrothers(int treeId, int? IdParent_1, int? IdParent_2, string userId, CancellationToken cancellationToken)
        {
            List<PersonDto> brothers = new List<PersonDto>();

            List<int> children = await _context.FamilyTies
                .Where(p => p.Parent1Id == IdParent_1 &&
                            p.Parent2Id == IdParent_2)
                .Select(p => p.PersonId)
                .Distinct()
                .ToListAsync(cancellationToken);

            if (children.Count == 0)
            {
                return null;
            }

            for (int i = 0; i < children.Count; i++)
            {
                int val = children[i];

                brothers.Add(await GetPerson(treeId, val, userId, cancellationToken));
            }

            return brothers;
        }

        private async Task<List<PersonDto>> GetWifes(int treeId, int personId, string userId, CancellationToken cancellationToken)
        {
            List<PersonDto> Wifes = new List<PersonDto>();
            List<int?> wifes_2 = await _context.FamilyTies
                .Where(p => p.PersonId == personId)
                .Select(t => t.MarriagePersonId)
                .Distinct()
                .ToListAsync(cancellationToken);

            if (wifes_2.Count == 1 && wifes_2[0] == null)
            {
                return null;
            }

            // В случае, если имеются дети со вторым родителем и дети без второго родителя
            // то дети без второго родителя не будут отображаться до появления второй жены или удаления первой
            wifes_2.RemoveAll(p => p == null);

            for (int i = 0; i < wifes_2.Count; i++)
            {
                int val = wifes_2[i].Value;

                Wifes.Add(await GetPerson(treeId, val, userId, cancellationToken));
            }

            return Wifes;
        }

        private async Task<List<PersonDto>> GetChildren(int treeId, int personId, int idWife, string userId, CancellationToken cancellationToken)
        {
            List<PersonDto> Sons = new List<PersonDto>();
            List<int?> sons_2 = new List<int?>();
            if (idWife == 0)
            {
                sons_2 = await _context.FamilyTies
                    .Where(p => p.PersonId == personId &&
                                p.MarriagePersonId == null)
                    .Select(t => t.ChildId)
                    .ToListAsync(cancellationToken);
            }
            else
            {
                sons_2 = await _context.FamilyTies
                    .Where(p => p.PersonId == personId &&
                                p.MarriagePersonId == idWife)
                    .Select(t => t.ChildId)
                    .ToListAsync(cancellationToken);
            }

            if (sons_2 == null || sons_2.Count == 0 || sons_2[0] == null)
            {
                return null;
            }

            for (int i = 0; i < sons_2.Count; i++)
            {
                int val = sons_2[i].Value;
                Sons.Add(await GetPerson(treeId, val, userId, cancellationToken));
            }

            return Sons;
        }

        private async Task<PersonDto> GetPerson(int treeId, int personId, string userId, CancellationToken cancellationToken)
        {
            PersonDto result = null;
            Person person = await _context.People
                .Where(p => p.CreatedBy.Equals(userId) &&
                            p.FamilyTreeId == treeId &&
                            p.Id == personId)
                .SingleOrDefaultAsync(cancellationToken);

            if (person != null)
            {
                List<DataCategory> dataCategories = await _context
                    .DataCategories
                    .Include(c => c.DataBlocks)
                    .ThenInclude(db => db.DataHolders)
                    .Where(c => c.PersonId == person.Id)
                    .ToListAsync(cancellationToken);

                List<DataBlock> dataBlocks = dataCategories.SelectMany(c => c.DataBlocks).ToList();
                List<DataHolder> dataHolders = dataBlocks.SelectMany(db => db.DataHolders).ToList();

                result = new PersonDto
                {
                    Id = person.Id,
                    Name = dataHolders.FirstOrDefault(dh => dh.DataHolderType == DataHolderType.Name).Data,
                    Surname = dataHolders.FirstOrDefault(dh => dh.DataHolderType == DataHolderType.Surname).Data,
                    Middlename = dataHolders.FirstOrDefault(dh => dh.DataHolderType == DataHolderType.MiddleName).Data,
                    Birthday = dataHolders.FirstOrDefault(dh => dh.DataHolderType == DataHolderType.Birthday).Data,
                    AvatarImageId = person.AvatarImageId,
                };
            }

            return result;
        }

        private List<PersonDto> ShiftWifes(List<PersonDto> list, int idMain)
        {
            List<PersonDto> newList = new List<PersonDto>();

            int i = 0;
            while (true)
            {
                if (list[i].Id != idMain) // поиск совпадения
                {
                    i++;
                    continue;
                }

                newList.Add(list[i]); // помещение в начало списка

                for (int k = i + 1; k < list.Count; k++) // добавление элементов, которые шли после найденного
                {
                    newList.Add(list[k]);
                }
                for (int k = 0; k < i; k++) // добавление элементов, которые шли перед найденным
                {
                    newList.Add(list[k]);
                }

                break;
            }

            return newList;
        }

        private async Task<bool> HaveParent(int treeId, int personId, string userId, CancellationToken cancellationToken)
        {
            var parent = await GetParent(treeId, personId, userId, cancellationToken);

            return (parent[0] != null) || (parent[1] != null);
        }

        private async Task<bool> HaveAnotherChild(int treeId, int personId, string userId, CancellationToken cancellationToken)
        {
            List<PersonDto> wifes = await GetWifes(treeId, personId, userId, cancellationToken);

            return (wifes != null) && (wifes.Count > 1);
        }

        private async Task<bool> HaveChildren(int personId, CancellationToken cancellationToken)
        {
            List<int?> sons_2 = await _context.FamilyTies
                .Where(p => p.PersonId == personId &&
                            p.ChildId != null)
                .Select(t => t.ChildId)
                .ToListAsync(cancellationToken);

            return (sons_2?.Count ?? 0) > 0;
        }

        private async Task<int> CountBrothers(int treeId, int personId, int? parent_1, int? parent_2, string userId, CancellationToken cancellationToken)
        {
            List<PersonDto> bro = await GetBrothers(treeId, parent_1, parent_2, userId, cancellationToken);
            bro.RemoveAll(p => p.Id == personId);

            return bro.Count;
        }

        private async Task<int> CountChildren(int treeId, int personId, int idWife, string userId, CancellationToken cancellationToken)
        {
            var children = await GetChildren(treeId, personId, idWife, userId, cancellationToken);

            return children?.Count() ?? 0;
        }

        private List<bool> CheckListOnBloodRelation(List<PersonDto> list, int bloodMainId)
        {
            if (list == null || list.Count == 0)
            {
                return null;
            }

            List<bool> listBlood = new List<bool>();

            for (int i = 0; i < list.Count; i++)
            {
                listBlood.Add(CheckBloodRelation(bloodMainId, list[i]));
            }

            return listBlood;
        }

        private bool CheckBloodRelation(int bloodMainId, PersonDto person)
        {
            if (person != null)
            {
                return BloodRelation(bloodMainId, person.Id);
            }

            return false;
        }

        public bool BloodRelation(int startId, int endId)
        {
            // startId - id человека, от которого начинается поиск
            // endId - id челокека, к которому ведется поиск, т.е. кем он приходится startId
            FindPerson = false;
            errorRecursive = 0;

            if (startId == endId)
            {
                return true;
            }

            List<int> numberLine = new List<int>();
            numberLine = FindLine(startId, endId);
            numberLine = CorrectLine(numberLine, startId);

            List<string> wordLine = GetNearRelation(numberLine, startId);

            CorrectBrothers(ref numberLine, ref wordLine, startId);

            List<int> direct = DefineDirectionInLine(wordLine);

            ReduceLineToGrand(ref numberLine, ref wordLine, ref direct);

            // Направления: 
            // -1 - направление наследников
            //  1 - направление предков
            //  0 - направление братьев/ сестер и жен/мужей            

            // :1 и :-1
            if (direct.Count == 1 && (direct[0] == 1 || direct[0] == -1))
            {
                return true;
            }

            // :0
            if (direct.Count == 1 && direct[0] == 0 &&
                (wordLine[0] == "сестра" || wordLine[0] == "брат"))
            {
                return true;
            }

            // :1 -> -1
            if (direct.Count == 2 && direct[0] == 1 && direct[1] == -1)
            {
                return true;
            }

            // :0 -> -1
            if (direct.Count == 2 && direct[0] == 0 &&
                (wordLine[0] == "сестра" || wordLine[0] == "брат") &&
                direct[1] == -1)
            {
                return true;
            }

            // :1 -> 0
            if (direct.Count == 2 && direct[0] == 1 &&
                (wordLine[1] == "сестра" || wordLine[1] == "брат") &&
                direct[1] == 0)
            {
                return true;
            }

            // :1 -> 0 -> -1
            if (direct.Count == 3 && direct[0] == 1 &&
                (wordLine[1] == "сестра" || wordLine[1] == "брат") &&
                direct[1] == 0 && direct[2] == -1)
            {
                return true;
            }

            return false;
        }

        // Загрузка данных о людях и их связях из базы данных
        private async Task LoadPeople(int treeId, string userId, CancellationToken cancellationToken)
        {
            People = new List<PersonNode>();

            // Получение списка id людей, которые принадлежат текущему аккаунту
            List<int> PeopleAccount = await _context.People
                .Where(p => p.FamilyTree.CreatedBy.Equals(userId) && 
                            p.FamilyTreeId == treeId)
                .Select(p => p.Id)
                .ToListAsync(cancellationToken);

            List<FamilyTie> ties = new List<FamilyTie>();

            // Получение всех семейных отношений, которые связаныы со списком людей текущего аккаунта
            for (int i = 0; i < PeopleAccount.Count; i++)
            {
                int idPeople = PeopleAccount[i];
                List<FamilyTie> tieList = await _context.FamilyTies
                    .Where(p => p.PersonId == idPeople)
                    .ToListAsync(cancellationToken);

                if (tieList != null)
                {
                    ties.AddRange(tieList);
                }
            }

            // Формирование данных о человеке как об узле в дереве
            for (int i = 0; i < PeopleAccount.Count; i++)
            {
                PersonNode pn = new PersonNode();

                // Получение всех семейных отношений у данного человека
                List<FamilyTie> list = ties
                    .Where(p => p.PersonId == PeopleAccount[i])
                    .ToList(); // всегда должна быть запись

                pn.Id_person = PeopleAccount[i];
                pn.Parent_1 = list[0].Parent1Id;
                pn.Parent_2 = list[0].Parent2Id;

                List<WifeChildren> listWife = new List<WifeChildren>(); // список жен с их детьми
                var listGroupWife = list.GroupBy(p => p.MarriagePersonId); // группирование по женам

                for (int t = 0; t < listGroupWife.Count(); t++)
                {
                    WifeChildren wc = new WifeChildren() // создание новой записи о жене
                    {
                        Wife = listGroupWife.ElementAt(t).Key,
                        Children = new List<int?>()
                    };

                    // Добавление всех детей с текущей женой
                    wc.Children.AddRange(listGroupWife.ElementAt(t).Select(p => p.ChildId).ToList());

                    // Не добавлять пустые записи
                    if (wc.Wife == null && wc.Children[0] == null)
                    {
                        continue;
                    }

                    // Добавить в список жен
                    listWife.Add(wc);
                }

                // Добавить список жен
                pn.WifeChildren = listWife;

                Person person = await _context.People
                    .Where(p => p.Id == pn.Id_person)
                    .FirstAsync(cancellationToken);

                // Добавить пол
                pn.Gender = await GetPersonGender(person.Id, cancellationToken);

                // Добавление узла в список узлов
                People.Add(pn);
            }
        }

        private async Task<string> GetPersonGender(int personId, CancellationToken cancellationToken)
        {
            List<DataCategory> dataCategories = await _context
                    .DataCategories
                    .Include(c => c.DataBlocks)
                    .ThenInclude(db => db.DataHolders)
                    .Where(c => c.PersonId == personId)
                    .ToListAsync(cancellationToken);

            List<DataBlock> dataBlocks = dataCategories.SelectMany(c => c.DataBlocks).ToList();
            List<DataHolder> dataHolders = dataBlocks.SelectMany(db => db.DataHolders).ToList();

            return dataHolders.FirstOrDefault(dh => dh.DataHolderType == DataHolderType.Gender).Data;
        }

        private async Task<string> GetPersonName(int personId, CancellationToken cancellationToken)
        {
            List<DataCategory> dataCategories = await _context
                    .DataCategories
                    .Include(c => c.DataBlocks)
                    .ThenInclude(db => db.DataHolders)
                    .Where(c => c.PersonId == personId)
                    .ToListAsync(cancellationToken);

            List<DataBlock> dataBlocks = dataCategories.SelectMany(c => c.DataBlocks).ToList();
            List<DataHolder> dataHolders = dataBlocks.SelectMany(db => db.DataHolders).ToList();

            return dataHolders.FirstOrDefault(dh => dh.DataHolderType == DataHolderType.Name).Data;
        }

        // Поиск числовой линии
        private List<int> FindLine(int startId, int endId)
        {
            List<int> line = new List<int>();

            RecursiveSearchLine(line, startId, endId);

            return Line;
        }

        private void RecursiveSearchLine(List<int> line, int currentId, int endId)
        {
            // Если текущий id и искомый совпадают
            if (currentId == endId)
            {
                FindPerson = true; // Найдено значение, числовая линия завершена
                Line = CopyList(line); // Копировать полученную линию в глобальную Line                
                return;
            }

            // Если найдена линия, то завершить все рекурсивные вызовы
            if (FindPerson)
            {
                return;
            }

            // Если возникло зацикливание
            if (errorRecursive == 50000)
            {
                throw new Exception();
            }
            else
            {
                errorRecursive++;
            }

            // Получить индекс человека в списке People по указанному id
            int currentPeopleIndex = People.FindIndex(p => p.Id_person == currentId);

            // waysList - список возможных путей для этой функции
            List<int> waysList = GetPossibleWays(People[currentPeopleIndex], line);

            if (waysList.Contains(endId))
            {
                FindPerson = true; // Найдено значение, числовая линия завершена
                line.Add(endId);
                Line = CopyList(line); // Копировать полученную линию в глобальную Line
                return;
            }

            for (int i = 0; i < waysList.Count; i++)
            {
                // Полное копирование составляющейся линии
                List<int> newLine = CopyList(line);

                // Добавить текущую вершину в линию
                newLine.Add(waysList[i]);

                // Рекурсивно вызвать, передав линию и ее список связей,
                // а также в качестве рассматриваемого currentId передать текущую вершину
                // и id искомого человека
                RecursiveSearchLine(newLine, waysList[i], endId);
            }
        }

        // Полное копирование списка чисел
        private List<int> CopyList(List<int> list)
        {
            List<int> newList = new List<int>();
            foreach (var value in list)
            {
                newList.Add(value);
            }
            return newList;
        }

        private List<int> GetPossibleWays(PersonNode pNode, List<int> line)
        {
            List<int> list = new List<int>();

            if (pNode.Parent_1 != null && !line.Contains(pNode.Parent_1.Value))
            {
                list.Add(pNode.Parent_1.Value);
            }

            if (pNode.Parent_2 != null && !line.Contains(pNode.Parent_2.Value))
            {
                list.Add(pNode.Parent_2.Value);
            }

            for (int i = 0; i < pNode.WifeChildren.Count; i++)
            {
                if (pNode.WifeChildren[i].Wife != null && !line.Contains(pNode.WifeChildren[i].Wife.Value))
                {
                    list.Add(pNode.WifeChildren[i].Wife.Value);
                }

                for (int k = 0; k < pNode.WifeChildren[i].Children.Count; k++)
                {
                    if (pNode.WifeChildren[i].Children[k] != null && !line.Contains(pNode.WifeChildren[i].Children[k].Value))
                    {
                        list.Add(pNode.WifeChildren[i].Children[k].Value);
                    }
                }
            }

            return list;
        }

        // Корректировка найденной линни т.е. упрощение линии и удаление лишних связей - (Сокращение уровень 1)
        private List<int> CorrectLine(List<int> line, int startId)
        {
            // Удаление всех элементов в кругах, замкнувшегося в начале
            while (line.Contains(startId))
            {
                while (true)
                {
                    if (line[0] == startId)
                    {
                        line.RemoveAt(0);
                        break;
                    }

                    line.RemoveAt(0);
                }
            }

            List<int> list = GetAllConnections(People.Find(p => p.Id_person == startId));

            for (int t = 0; t < list.Count; t++)
            {
                if (line.Contains(list[t]))
                {
                    int index = line.FindIndex(p => p == list[t]);
                    if (index > 0)
                    {
                        line.RemoveRange(0, index);
                    }
                }
            }

            // Сокращение линии
            for (int i = 0; i < line.Count; i++)
            {
                list = GetAllConnections(People.Find(p => p.Id_person == line[i]));

                for (int t = 0; t < list.Count; t++)
                {
                    if (line.Contains(list[t]))
                    {
                        int index = line.FindIndex(p => p == list[t]);
                        if (index - i > 1)
                        {
                            line.RemoveRange(i + 1, index - i - 1);
                        }
                    }
                }

            }

            return line;
        }

        private List<int> GetAllConnections(PersonNode pn)
        {
            List<int> list = new List<int>();

            if (pn == null)
                return list;

            if (pn.Parent_1 != null)
            {
                list.Add(pn.Parent_1.Value);

            }
            if (pn.Parent_2 != null)
            {
                list.Add(pn.Parent_2.Value);

            }

            for (int k = 0; k < pn.WifeChildren.Count; k++)
            {
                if (pn.WifeChildren[k].Wife != null)
                {
                    list.Add(pn.WifeChildren[k].Wife.Value);
                }

                for (int c = 0; c < pn.WifeChildren[k].Children.Count; c++)
                {
                    if (pn.WifeChildren[k].Children[c] != null)
                    {
                        list.Add(pn.WifeChildren[k].Children[c].Value);
                    }
                }
            }

            return list;
        }

        // получение текстового значения ближайшего родственника
        // т.е. отец, дочь, мать или сын
        private List<string> GetNearRelation(List<int> line, int startId)
        {
            List<string> wordLine = new List<string>();

            int startIdLine = startId;

            PersonNode pn;
            string gender;

            for (int i = 0; i < line.Count; i++)
            {
                pn = People.Find(p => p.Id_person == startIdLine);
                startIdLine = line[i];

                // Родитель 1
                if (line[i] == pn.Parent_1)
                {
                    gender = People.Find(p => p.Id_person == pn.Parent_1).Gender;
                    if (gender == "Male")
                    {
                        wordLine.Add("отец");
                    }
                    else if(gender == "Female")
                    {
                        wordLine.Add("мать");
                    }
                    else
                    {
                        wordLine.Add("неизвестно");
                    }

                    continue;
                }

                // Родитель 2
                if (line[i] == pn.Parent_2)
                {
                    gender = People.Find(p => p.Id_person == pn.Parent_2).Gender;
                    if (gender == "Male")
                    {
                        wordLine.Add("отец");
                    }
                    else if(gender == "Female")
                    {
                        wordLine.Add("мать");
                    }
                    else
                    {
                        wordLine.Add("неизвестно");
                    }

                    continue;
                }

                // Жена / муж
                if (pn.WifeChildren != null)
                {
                    for (int t = 0; t < pn.WifeChildren.Count; t++)
                    {
                        if (pn.WifeChildren[t].Wife != null)
                        {
                            if (line[i] == pn.WifeChildren[t].Wife)
                            {
                                gender = People.Find(p => p.Id_person == pn.WifeChildren[t].Wife).Gender;
                                if (gender == "Male")
                                {
                                    wordLine.Add("муж");
                                }
                                else if (gender == "Female")
                                {
                                    wordLine.Add("жена");
                                }
                                else
                                {
                                    wordLine.Add("неизвестно");
                                }
                            }
                        }
                    }
                }

                // Ребенок
                if (pn.WifeChildren != null)
                {
                    for (int t = 0; t < pn.WifeChildren.Count; t++)
                    {
                        if (pn.WifeChildren[t].Children != null)
                        {
                            for (int k = 0; k < pn.WifeChildren[t].Children.Count; k++)
                            {
                                if (line[i] == pn.WifeChildren[t].Children[k])
                                {
                                    gender = People.Find(p => p.Id_person == pn.WifeChildren[t].Children[k]).Gender;
                                    if (gender == "Male")
                                    {
                                        wordLine.Add("сын");
                                    }
                                    else if (gender == "Female")
                                    {
                                        wordLine.Add("дочь");
                                    }
                                    else
                                    {
                                        wordLine.Add("неизвестно");
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return wordLine;
        }

        // Поиск и корректировка линии при наличии братьев/сестер - (Сокращение уровень 2)
        private void CorrectBrothers(ref List<int> line, ref List<string> wordLine, int startId)
        {
            PersonNode pn, pnBro;

            for (int i = -1; i < line.Count; i++)
            {
                if (i < line.Count - 2)
                {
                    int lineVal = 0;

                    if (i == -1)
                    {
                        pn = People.Find(p => p.Id_person == startId);
                    }
                    else
                    {
                        lineVal = line[i];
                        pn = People.Find(p => p.Id_person == lineVal);
                    }

                    lineVal = line[i + 2];

                    pnBro = People.Find(p => p.Id_person == lineVal);
                    if (pn.Parent_1 != null || pn.Parent_2 != null)
                    {
                        if (pn.Parent_1 == pnBro.Parent_1 && pn.Parent_2 == pnBro.Parent_2)
                        {
                            line.RemoveAt(i + 1);
                            wordLine.RemoveAt(i + 1);
                            if (pnBro.Gender == "Male")
                            {
                                wordLine[i + 1] = "брат";
                            }
                            else if (pnBro.Gender == "Female")
                            {
                                wordLine[i + 1] = "сестра";
                            }
                            else
                            {
                                wordLine[i + 1] = "неизвестно";
                            }
                        }
                    }

                }
            }
        }

        // Определение движения по дереву
        private List<int> DefineDirectionInLine(List<string> wordLine)
        {
            List<int> res = new List<int>();

            for (int i = 0; i < wordLine.Count; i++)
            {
                if (wordLine[i] == "отец" || wordLine[i] == "мать" || wordLine[i] == "неизвестно")
                {
                    res.Add(1);
                }
                if (wordLine[i] == "брат" || wordLine[i] == "сестра" || wordLine[i] == "муж" || wordLine[i] == "жена")
                {
                    res.Add(0);
                }
                if (wordLine[i] == "сын" || wordLine[i] == "дочь")
                {
                    res.Add(-1);
                }
            }

            return res;
        }

        // Сокращение до пра..дедушек и пра...внучек - (Сокращение уровень 3)
        private void ReduceLineToGrand(ref List<int> line, ref List<string> wordLine, ref List<int> direct)
        {
            // Если пустой список, то завершить метод
            if (direct == null || direct.Count == 0)
            {
                return;
            }

            int startChange = 0; // Начальная точка отсчета счетчика
            int countNotChangeDirect = 0; // Счетчик, показываеющий кол-во итераций без изменения направления
            int currentStage = direct[0]; // Текущее направление

            for (int i = 0; i < wordLine.Count; i++)
            {
                if (currentStage == direct[i])
                {
                    if (currentStage != 0)
                    {
                        countNotChangeDirect++;
                    }

                    if (i == wordLine.Count - 1)
                    {
                        if (countNotChangeDirect > 1)
                        {
                            i--;
                            currentStage = 2;
                            continue;
                        }
                    }

                }
                else // При изменении направления
                {
                    if (countNotChangeDirect > 1)
                    {
                        line.RemoveRange(startChange, countNotChangeDirect - 1);
                        wordLine.RemoveRange(startChange, countNotChangeDirect - 1);
                        direct.RemoveRange(startChange, countNotChangeDirect - 1);

                        if (wordLine[startChange] == "отец")
                        {
                            wordLine[startChange] = SetGrandToString("дедушка", countNotChangeDirect - 2);
                        }

                        if (wordLine[startChange] == "мать")
                        {
                            wordLine[startChange] = SetGrandToString("бабушка", countNotChangeDirect - 2);
                        }

                        if (wordLine[startChange] == "сын")
                        {
                            wordLine[startChange] = SetGrandToString("внук", countNotChangeDirect - 2);
                        }

                        if (wordLine[startChange] == "дочь")
                        {
                            wordLine[startChange] = SetGrandToString("внучка", countNotChangeDirect - 2);
                        }

                        i = startChange;
                    }

                    startChange = i;
                    currentStage = direct[i];
                    countNotChangeDirect = 1;
                }
            }
        }

        // Добавление количества "пра" в начало
        private string SetGrandToString(string str, int countGrand)
        {
            string res = "";
            if (countGrand < 4)
            {
                for (int i = 0; i < countGrand; i++)
                {
                    res += "пра";
                }
            }
            else
            {
                res += countGrand + "-пра";
            }


            res += str;

            return res;
        }

        /* // Дополнение: Функция получения лет жизни человека.
        public async Task<string> FindLifeYears(int userId, CancellationToken cancellationToken)
        {
            // userId - id человека, возраст которого нужно высчитать 

            List<int> numberLine = FindRelationLine(startId, endId);
            string resultLine = await ChangeLine(numberLine, startId, cancellationToken);

            return resultLine;
        }
        */  // Дополнение: Функция получения лет жизни человека.

        public async Task<string> FindRelation(int startId, int endId, CancellationToken cancellationToken)
        {
            // startId - id человека, от которого начинается поиск
            // endId - id челокека, к которому ведется поиск, т.е. кем он приходится startId          

            List<int> numberLine = FindRelationLine(startId, endId);
            string resultLine = await ChangeLine(numberLine, startId, cancellationToken);

            return resultLine;
        }

        private List<int> FindRelationLine(int startId, int endId)
        {
            // startId - id человека, от которого начинается поиск
            // endId - id челокека, к которому ведется поиск, т.е. кем он приходится startId
            FindPerson = false;
            errorRecursive = 0;

            List<int> numberLine = new List<int>();
            numberLine = FindLine(startId, endId);
            numberLine = CorrectLine(numberLine, startId);
            return numberLine;
        }

        // По данной линии сформировать ее словесное описание
        private async Task<string> ChangeLine(List<int> line, int startId, CancellationToken cancellationToken)
        {
            List<string> wordLine = GetNearRelation(line, startId);

            CorrectBrothers(ref line, ref wordLine, startId);

            List<int> direct = DefineDirectionInLine(wordLine);

            ReduceLineToGrand(ref line, ref wordLine, ref direct);

            line.Reverse();
            wordLine.Reverse();
            wordLine = CorrectWords(wordLine);

            List<string> nameLine = await GetNames(line, cancellationToken);

            string result = "";
            for (int i = 0; i < line.Count; i++)
            {
                if (i == 0)
                {
                    result = wordLine[i].Substring(0, 1).ToUpper() + wordLine[i].Substring(1);
                }
                else
                {
                    result += " " + wordLine[i] + " " + nameLine[i];
                }
            }
            return result;
        }

        // Коррекция окончаний в словах
        private List<string> CorrectWords(List<string> wordLine)
        {
            for (int i = 1; i < wordLine.Count; i++)
            {
                if (wordLine[i] == "отец")
                {
                    wordLine[i] = "отца";
                    continue;
                }
                if (wordLine[i] == "мать")
                {
                    wordLine[i] = "матери";
                    continue;
                }
                if (wordLine[i] == "сын")
                {
                    wordLine[i] = "сына";
                    continue;
                }
                if (wordLine[i] == "дочь")
                {
                    wordLine[i] = "дочери";
                    continue;
                }
                if (wordLine[i] == "брат")
                {
                    wordLine[i] = "брата";
                    continue;
                }
                if (wordLine[i] == "сестра")
                {
                    wordLine[i] = "сестры";
                    continue;
                }
                if (wordLine[i] == "муж")
                {
                    wordLine[i] = "мужа";
                    continue;
                }
                if (wordLine[i] == "жена")
                {
                    wordLine[i] = "жены";
                    continue;
                }

                if (wordLine[i].Contains("внук"))
                {
                    wordLine[i] += "а";
                    continue;
                }

                wordLine[i] = wordLine[i].Remove(wordLine[i].Length - 1, 1) + "и";
            }

            return wordLine;
        }

        // Получение имен по списку id значений
        private async Task<List<string>> GetNames(List<int> line, CancellationToken cancellationToken)
        {
            List<string> res = new List<string>();

            int val = 0;
            for (int i = 0; i < line.Count; i++)
            {
                val = line[i];

                Person person = await _context.People
                    .Where(p => p.Id == val)
                    .FirstAsync(cancellationToken);

                string s = await GetPersonName(person.Id, cancellationToken);
                res.Add(s);
            }

            return res;
        }

        // Рекурсивный поиск людей в дереве
        private void FindPartTree(PersonNode pn, List<int> list)
        {
            if (errorRecursive > 50000)
            {
                throw new Exception();
            }

            List<int> ways = GetPossibleWays(pn, list);
            list.AddRange(ways);
            int idWay = 0;
            for (int i = 0; i < ways.Count; i++)
            {
                idWay = ways[i];
                FindPartTree(People.First(p => p.Id_person == idWay), list);
            }
        }
    }
}
