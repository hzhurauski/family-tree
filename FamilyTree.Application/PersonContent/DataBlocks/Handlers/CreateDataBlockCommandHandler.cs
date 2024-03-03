using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Interfaces;
using FamilyTree.Application.PersonContent.DataBlocks.Commands;
using FamilyTree.Domain.Entities.PersonContent;
using FamilyTree.Domain.Entities.Privacy;
using FamilyTree.Domain.Enums.PersonContent;
using FamilyTree.Domain.Enums.Privacy;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FamilyTree.Application.PersonContent.DataBlocks.Handlers
{
    public class CreateDataBlockCommandHandler : IRequestHandler<CreateDataBlockCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateDataBlockCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateDataBlockCommand request, CancellationToken cancellationToken)
        {
            DataCategory dataCategory = await _context.DataCategories
                .Include(dc => dc.DataBlocks)
                .SingleOrDefaultAsync(dc => dc.CreatedBy.Equals(request.UserId) &&
                                            dc.Id == request.DataCategoryId, 
                                      cancellationToken);

            if (dataCategory == null)
                throw new NotFoundException(nameof(DataCategory), request.DataCategoryId);

            if (dataCategory.DataCategoryType == DataCategoryType.InfoBlock ||
                dataCategory.DataCategoryType == DataCategoryType.PersonInfo)
                throw new Exception($"Can not copy to DataCategory with CategoryType = \"{dataCategory.DataCategoryType}\"");

            DataBlock entity = new DataBlock();
            entity.DataCategoryId = dataCategory.Id;
            entity.Title = request.Title;
            entity.OrderNumber = dataCategory.DataBlocks.Count() + 1;

            switch (dataCategory.DataCategoryType)
            {
                case DataCategoryType.Education:
                    FillDefaultEducationDataBlock(entity);
                    break;

                case DataCategoryType.Residencies:
                    FillDefaultResidenciesDataBlock(entity);
                    break;

                case DataCategoryType.LaborActivities:
                    FillDefaultLaborActivitiesDataBlock(entity);
                    break;

                case DataCategoryType.ImportantEvents:
                    FillDefaultImportantEventsDataBlock(entity);
                    break;

                default:
                    break;
            }

            if (entity.DataHolders != null)
            {
                foreach (var dataHolder in entity.DataHolders)
                {
                    dataHolder.Privacy = CreateDefaultPrivacy();
                }
            }                

            _context.DataBlocks.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }

        private void FillDefaultEducationDataBlock(DataBlock dataBlock)
        {
            dataBlock.DataHolders = new List<DataHolder>()
            {
                new DataHolder() 
                {
                    Title = "Место обучения",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 1
                },
                new DataHolder()
                {
                    Title = "Город",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 2
                },
                new DataHolder()
                {
                    Title = "Страна",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 3
                },
                new DataHolder()
                {
                    Title = "Начало обучения",
                    DataHolderType = DataHolderType.Date,
                    OrderNumber = 4
                },
                new DataHolder()
                {
                    Title = "Конец обучения",
                    DataHolderType = DataHolderType.Date,
                    OrderNumber = 5
                },
                new DataHolder()
                {
                    Title = "Специальность",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 6
                },
                new DataHolder()
                {
                    Title = "Тип документа",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 7
                },
                new DataHolder()
                {
                    Title = "Номер документа",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 8
                },
                new DataHolder()
                {
                    Title = "Дата получения документа",
                    DataHolderType = DataHolderType.Date,
                    OrderNumber = 9
                }
            };
        }

        private void FillDefaultResidenciesDataBlock(DataBlock dataBlock)
        {
            dataBlock.DataHolders = new List<DataHolder>()
            {
                new DataHolder()
                {
                    Title = "Дата прибытия",
                    DataHolderType = DataHolderType.Date,
                    OrderNumber = 1
                },
                new DataHolder()
                {
                    Title = "Дата убытия",
                    DataHolderType = DataHolderType.Date,
                    OrderNumber = 2
                },
                new DataHolder()
                {
                    Title = "Улица",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 3
                },
                new DataHolder()
                {
                    Title = "Дом №",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 4
                },
                new DataHolder()
                {
                    Title = "Город",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 5
                },
                new DataHolder()
                {
                    Title = "Страна",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 6
                }
            };
        }

        private void FillDefaultLaborActivitiesDataBlock(DataBlock dataBlock)
        {
            dataBlock.DataHolders = new List<DataHolder>()
            {
                new DataHolder()
                {
                    Title = "Дата найма",
                    DataHolderType = DataHolderType.Date,
                    OrderNumber = 1
                },
                new DataHolder()
                {
                    Title = "Дата увольнения",
                    DataHolderType = DataHolderType.Date,
                    OrderNumber = 2
                },
                new DataHolder()
                {
                    Title = "Должность",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 3
                },
                new DataHolder()
                {
                    Title = "Организация",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 4
                },
                new DataHolder()
                {
                    Title = "Улица",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 5
                },
                new DataHolder()
                {
                    Title = "Дом №",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 6
                },
                new DataHolder()
                {
                    Title = "Город",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 7
                },
                new DataHolder()
                {
                    Title = "Страна",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 8
                }
            };
        }

        private void FillDefaultImportantEventsDataBlock(DataBlock dataBlock)
        {
            dataBlock.DataHolders = new List<DataHolder>()
            {
                new DataHolder()
                {
                    Title = "Дата события",
                    DataHolderType = DataHolderType.Date,
                    OrderNumber = 1
                },
                new DataHolder()
                {
                    Title = "Город",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 2
                },
                new DataHolder()
                {
                    Title = "Страна",
                    DataHolderType = DataHolderType.Text,
                    OrderNumber = 3
                },
                new DataHolder()
                {
                    Title = "Описание",
                    DataHolderType = DataHolderType.TextArea,
                    OrderNumber = 4
                }
            };
        }

        private PrivacyEntity CreateDefaultPrivacy()
        {
            return new PrivacyEntity() 
            {
                IsAlways = true,
                PrivacyLevel = PrivacyLevel.Confidential
            };
        }
    }
}
