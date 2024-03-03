using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.People.Commands;
using FamilyTree.Application.People.Enums;
using FamilyTree.Domain.Entities.Tree;
using FamilyTree.Domain.Entities.PersonContent;
using FamilyTree.Domain.Enums.PersonContent;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FamilyTree.Domain.Entities.Privacy;
using FamilyTree.Domain.Enums.Privacy;
using FamilyTree.Application.Common.Exceptions;

namespace FamilyTree.Application.People.Handlers
{
    public class CreatePersonCommandHandler : IRequestHandler<CreatePersonCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreatePersonCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreatePersonCommand request, CancellationToken cancellationToken)
        {
            FamilyTreeEntity familyTree = await _context.FamilyTrees
                .Where(t => t.CreatedBy.Equals(request.UserId) &&
                            t.Id == request.TreeId)
                .Include(ft => ft.People)
                .SingleOrDefaultAsync(cancellationToken);

            if (familyTree == null)
                throw new NotFoundException(nameof(FamilyTreeEntity), request.TreeId);

            Person person = new Person();

            if (familyTree.People.Count == 0)
            {
                FamilyTie tie = new FamilyTie();
                tie.Person = person;

                familyTree.MainPerson = person;

                _context.FamilyTies.Add(tie);
            }
            else 
            {
                FamilyTie mainPersonTie = null;
                if (request.WifeId == 0)
                    mainPersonTie = await _context.FamilyTies
                        .FirstAsync(p => p.PersonId == request.MainPersonId, 
                                    cancellationToken);
                else
                    mainPersonTie = await _context.FamilyTies
                        .FirstAsync(p => p.PersonId == request.MainPersonId && 
                                         p.MarriagePersonId == request.WifeId,
                                    cancellationToken);

                switch (request.PersonRelationType)
                {
                    case PersonRelationType.Sibling:
                        await AddSibling(mainPersonTie, person, cancellationToken);
                        break;
                    case PersonRelationType.Parent:
                        await AddParent(mainPersonTie, person, request.ParentNumber, cancellationToken);
                        break;
                    case PersonRelationType.Child:
                        await AddChild(mainPersonTie, person, cancellationToken);
                        break;
                    case PersonRelationType.Lover:
                        await AddLover(mainPersonTie, person, cancellationToken);
                        break;

                    default:
                        break;
                }                
            }

            familyTree.People.Add(person);

            CreateDefaults(request, person);

            _context.People.Add(person);
            await _context.SaveChangesAsync(cancellationToken);            

            return person.Id;
        }

        private void CreateDefaults(CreatePersonCommand request, Person person)
        {
            DataCategory personInfoDataCategory = new DataCategory()
            {
                DataCategoryType = DataCategoryType.PersonInfo,
                Name = "Персональные данные",
                OrderNumber = 1,
                Person = person,
                IsDeletable = false
            };

            DataBlock dataBlock = new DataBlock() { Title = String.Empty };
            dataBlock.DataHolders = new List<DataHolder>();
            dataBlock.DataHolders.Add(new DataHolder() 
            { 
                Title = "Имя", 
                Data = request.Name, 
                DataHolderType = DataHolderType.Name, 
                OrderNumber = 1,
                IsDeletable = false,
                Privacy = CreateDefaultPrivacy()
            });
            dataBlock.DataHolders.Add(new DataHolder() 
            { 
                Title = "Фамилия", 
                Data = request.Surname, 
                DataHolderType = DataHolderType.Surname, 
                OrderNumber = 2,
                IsDeletable = false,
                Privacy = CreateDefaultPrivacy()
            });
            dataBlock.DataHolders.Add(new DataHolder() 
            { 
                Title = "Отчество", 
                Data = request.Middlename, 
                DataHolderType = DataHolderType.MiddleName, 
                OrderNumber = 3,
                IsDeletable = false,
                Privacy = CreateDefaultPrivacy()
            });
            dataBlock.DataHolders.Add(new DataHolder() 
            { 
                Title = "День рождения", 
                Data = request.Birthday.ToString(), 
                DataHolderType = DataHolderType.Birthday, 
                OrderNumber = 4,
                IsDeletable = false,
                Privacy = CreateDefaultPrivacy()
            });
            dataBlock.DataHolders.Add(new DataHolder() 
            { 
                Title = "Пол", 
                Data = request.Gender.ToString(), 
                DataHolderType = DataHolderType.Gender, 
                OrderNumber = 5,
                IsDeletable = false,
                Privacy = CreateDefaultPrivacy()
            });

            personInfoDataCategory.DataBlocks = new List<DataBlock>();
            personInfoDataCategory.DataBlocks.Add(dataBlock);

            DataCategory educationDataCategory = new DataCategory()
            {
                DataCategoryType = DataCategoryType.Education,
                Name = "Образование",
                OrderNumber = 2,
                Person = person,
                IsDeletable = false
            };

            DataCategory laborActivitiesDataCategory = new DataCategory()
            {
                DataCategoryType = DataCategoryType.LaborActivities,
                Name = "Трудовая деятельность",
                OrderNumber = 3,
                Person = person,
                IsDeletable = false
            };

            DataCategory residenciesDataCategory = new DataCategory()
            {
                DataCategoryType = DataCategoryType.Residencies,
                Name = "Места проживания",
                OrderNumber = 4,
                Person = person,
                IsDeletable = false
            };

            DataCategory importantEventsDataCategory = new DataCategory()
            {
                DataCategoryType = DataCategoryType.ImportantEvents,
                Name = "Важные cобытия",
                OrderNumber = 5,
                Person = person,
                IsDeletable = false
            };

            _context.DataCategories.Add(personInfoDataCategory);
            _context.DataCategories.Add(educationDataCategory);
            _context.DataCategories.Add(laborActivitiesDataCategory);
            _context.DataCategories.Add(residenciesDataCategory);
            _context.DataCategories.Add(importantEventsDataCategory);
        }

        private PrivacyEntity CreateDefaultPrivacy()
        {
            return new PrivacyEntity() 
            {
                PrivacyLevel = PrivacyLevel.Confidential,
                IsAlways = true
            };
        }

        private async Task AddSibling(FamilyTie tie, Person person, CancellationToken cancellationToken)
        {
            _context.FamilyTies.Add(new FamilyTie()
            {
                Person = person,
                Parent1 = tie.Parent1,
                Parent2 = tie.Parent2
            });

            if (tie.Parent1 != null)
            {
                FamilyTie par1 = await _context.FamilyTies
                    .FirstAsync(p => p.PersonId == tie.Parent1Id, 
                                cancellationToken);
                
                _context.FamilyTies.Add(new FamilyTie()
                {
                    Person = tie.Parent1,
                    Parent1 = par1.Parent1,
                    Parent2 = par1.Parent2,
                    Child = person,
                    MarriagePerson = tie.Parent2
                });
            }
            if (tie.Parent2 != null)
            {
                FamilyTie par2 = await _context.FamilyTies
                    .FirstAsync(p => p.PersonId == tie.Parent2Id, 
                                cancellationToken);

                _context.FamilyTies.Add(new FamilyTie()
                {
                    Person = tie.Parent2,
                    Parent1 = par2.Parent1,
                    Parent2 = par2.Parent2,
                    Child = person,
                    MarriagePerson = tie.Parent1
                });
            }
        }

        private async Task AddParent(FamilyTie tie, Person person, int parentNumber, CancellationToken cancellationToken)
        {
            FamilyTie ft = new FamilyTie() { Person = person };

            List<int> ftPar1List = new List<int>();

            // Добавление связи с женой, если имеется другой родитель
            if (tie.Parent1 != null)
            {
                ft.MarriagePerson = tie.Parent1;
                ftPar1List = await _context.FamilyTies
                    .Where(p => p.PersonId == tie.Parent1Id && 
                                p.MarriagePerson == null)
                    .Select(p => p.Id)
                    .ToListAsync(cancellationToken);
            }
            if (tie.Parent2 != null)
            {
                ft.MarriagePerson = tie.Parent2;
                ftPar1List = await _context.FamilyTies
                    .Where(p => p.PersonId == tie.Parent2Id && 
                                p.MarriagePerson == null)
                    .Select(p => p.Id)
                    .ToListAsync(cancellationToken);
            }

            for (int i = 0; i < ftPar1List.Count; i++)
            {
                int val = ftPar1List[i];
                FamilyTie ftPar = await _context.FamilyTies
                    .FirstAsync(p => p.Id == val,
                                cancellationToken);
                ftPar.MarriagePerson = person;
            }

            // Список всех братьев у person
            List<int> childrenList = new List<int>();
            if (tie.Parent1 != null || tie.Parent2 != null)
            {
                childrenList = await _context.FamilyTies
                    .Where(p => p.Parent1Id == tie.Parent1Id && 
                                p.Parent2Id == tie.Parent2Id)
                    .Select(p => p.PersonId)
                    .ToListAsync(cancellationToken);
            }
            else
            {
                childrenList.Add(tie.PersonId);
            }

            // Добавление связи родителя с детьми и добавление в бд
            for (int i = 0; i < childrenList.Count; i++)
            {
                ft.ChildId = childrenList[i];
                _context.FamilyTies.Add(ft);
            }

            // Обновление полей у детей
            for (int i = 0; i < childrenList.Count; i++)
            {
                int valChild = childrenList[i];
                FamilyTie _contextTies = await _context.FamilyTies
                    .FirstAsync(p => p.PersonId == valChild,
                                cancellationToken);
                
                if (parentNumber == 1)
                {
                    _contextTies.Parent1 = person;
                }
                else
                {
                    _contextTies.Parent2 = person;
                }
            }
        }

        private async Task AddChild(FamilyTie tie, Person person, CancellationToken cancellationToken)
        {
            _context.FamilyTies.Add(new FamilyTie()
            {
                Person = person,
                Parent1 = tie.Person,
                Parent2 = tie.MarriagePerson
            });

            // Добавление связи Person и MarriagePerson с ребенком
            List<FamilyTie> ft_l = await _context.FamilyTies
                .Where(p => p.PersonId == tie.PersonId && 
                            p.MarriagePersonId == tie.MarriagePersonId)
                .ToListAsync(cancellationToken);

            if (ft_l[0].Child == null)
            {
                FamilyTie ftc = await _context.FamilyTies
                    .FirstAsync(p => p.PersonId == tie.PersonId && 
                                     p.MarriagePersonId == tie.MarriagePersonId,
                                cancellationToken);

                ftc.Child = person;

                if (tie.MarriagePerson != null)
                {
                    ftc = await _context.FamilyTies
                        .FirstAsync(p => p.PersonId == tie.MarriagePersonId && 
                                         p.MarriagePersonId == tie.PersonId,
                                    cancellationToken);

                    ftc.Child = person;
                }
            }
            else
            {
                _context.FamilyTies.Add(new FamilyTie()
                {
                    Person = tie.Person,
                    Parent1 = tie.Parent1,
                    Parent2 = tie.Parent2,
                    Child = person,
                    MarriagePerson = tie.MarriagePerson
                });

                if (tie.MarriagePerson != null)
                {
                    FamilyTie wife = await _context.FamilyTies
                        .FirstAsync(p => p.PersonId == tie.MarriagePersonId,
                                    cancellationToken);

                    if (wife.Child == null)
                    {
                        wife.Child = person;
                    }
                    else
                    {
                        _context.FamilyTies.Add(new FamilyTie()
                        {
                            Person = wife.Person,
                            Parent1 = wife.Parent1,
                            Parent2 = wife.Parent2,
                            Child = person,
                            MarriagePerson = tie.Person
                        });
                    }

                }
            }
        }

        private async Task AddLover(FamilyTie tie, Person person, CancellationToken cancellationToken)
        {
            FamilyTie ft = new FamilyTie()
            {
                Person = person,
                MarriagePerson = tie.Person
            };

            // Получить всех детей у tie.Person, у которых один из родителей отсутствует
            List<int> childrenList = new List<int>();
            childrenList = await _context.FamilyTies
                .Where(p => (p.Parent1Id == tie.PersonId && p.Parent2 == null) ||
                            (p.Parent1 == null && p.Parent2Id == tie.PersonId))
                .Select(p => p.PersonId)
                .Distinct()
                .ToListAsync(cancellationToken);

            if (childrenList != null && childrenList.Count > 0)
            {
                for (int i = 0; i < childrenList.Count; i++)
                {
                    int val = childrenList[i];
                    // Добавление связи жены с детьми и второго родителя во главе жены 
                    ft.ChildId = childrenList[i];
                    _context.FamilyTies.Add(ft);

                    // Изменение записи у детей
                    List<int> ftChildList = await _context.FamilyTies
                        .Where(p => p.PersonId == val)
                        .Select(p => p.Id)
                        .ToListAsync(cancellationToken);

                    for (int t = 0; t < ftChildList.Count; t++)
                    {
                        int valList = ftChildList[t];
                        FamilyTie ftChild = await _context.FamilyTies
                            .FirstAsync(p => p.Id == valList,
                                        cancellationToken);

                        if (ftChild.Parent1 == null)
                        {
                            ftChild.Parent1 = person;
                        }
                        else
                        {
                            ftChild.Parent2 = person;
                        }
                    }

                    // Изменение записи у родителя tie.PersonId
                    FamilyTie ftParent = await _context.FamilyTies
                        .FirstAsync(p => p.PersonId == tie.PersonId && 
                                         p.ChildId == val,
                                    cancellationToken);

                    ftParent.MarriagePerson = person;
                }
            }
            else
            {
                // Добавление записи жены о связи с tie.PersonId без детей
                FamilyTie ft_1 = await _context.FamilyTies
                    .FirstOrDefaultAsync(p => p.PersonId == tie.PersonId && 
                                              p.MarriagePerson == null,
                                         cancellationToken);

                if (ft_1 == null)
                {
                    _context.FamilyTies.Add(new FamilyTie()
                    {
                        Person = tie.Person,
                        Parent1 = tie.Parent1,
                        Parent2 = tie.Parent2,
                        MarriagePerson = person
                    });
                }
                else
                {
                    ft_1.MarriagePerson = person;
                }

                _context.FamilyTies.Add(ft);
            }
        }
    }
}
