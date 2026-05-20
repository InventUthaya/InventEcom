using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using AutoMapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.DataMappers.EntityMappers;
using DofyEcom.DataMappers.ModelMappers;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class GradeMasterModel : BaseModel<DBO.GradeMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;
        private readonly GradeMasterEntityMapper entityMapper;
        private readonly GradeMasterModelMapper modelMapper;

        public GradeMasterModel(
            IOptionsSnapshot<AppConfiguration> iConfig,
            IMapper iMapper,
            IPrincipal? iPrincipal = null,
            CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public ViewEntities.GradeMaster Get(long id)
        {
            var result = this.FindItem(item => item.Id == id && item.IsActive == true);
            if (result is not null)
            {
                return mapper.Map<ViewEntities.GradeMaster>(result);
            }
            return default;
        }

        public IEnumerable<DBO.GradeMaster> GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            return results;
        }

        public IEnumerable<ViewEntities.GradeMaster> GetActiveGradeForDropdown()
        {
            var results = this.FindItems(item => item.IsActive == true && item.DisplayInList == true)
                           .OrderBy(r => r.GradeName);

            if (results != null && results.Any())
            {
                var viewEntities = new List<ViewEntities.GradeMaster>();
                foreach (var result in results)
                {
                    viewEntities.Add(entityMapper.Convert(result, new ViewEntities.GradeMaster(), null));
                }
                return viewEntities;
            }
            return new List<ViewEntities.GradeMaster>();
        }

        public long Post(ViewEntities.GradeMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = modelMapper.Convert(item, new DBO.GradeMaster(), null);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Post(ViewEntities.GradeMaster item)
        {
            var dboItem = modelMapper.Convert(item, new DBO.GradeMaster(), null);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Put(ViewEntities.GradeMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = modelMapper.Convert(item, new DBO.GradeMaster(), null);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

            this.UpdateItem(dboItem);
            return item.Id;
        }

        public long Put(ViewEntities.GradeMaster item)
        {
            var dboItem = modelMapper.Convert(item, new DBO.GradeMaster(), null);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

            this.UpdateItem(dboItem);
            return item.Id;
        }

        public bool Remove(long id)
        {
            var grade = this.FindById(id);
            if (grade is not null)
            {
                grade.IsActive = false;
                grade.Modified = DateTime.Now;
                grade.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

                this.UpdateItem(grade);
                return true;
            }
            return false;
        }

        public string GetGradeNameById(long gradeId)
        {
            var grade = this.Get((int)gradeId);
            return grade?.GradeName ?? "Unknown Grade";
        }
    }
}