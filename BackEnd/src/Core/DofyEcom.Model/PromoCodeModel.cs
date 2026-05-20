namespace DofyEcom.Model
{
    using System.Data;
    using System.Data.SqlClient;
    using System.Security.Principal;
    using AutoMapper;
    using Dapper;
    using DataTables.AspNet.Core;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using DofyEcom.ViewEntities;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    public class PromoCodeModel : BaseModel<DBO.PromoCode>, IPromoCodeModel
    {
        private readonly IMapper mapper;

        public PromoCodeModel(
            IOptionsSnapshot<AppConfiguration> iConfig,
            IMapper iMapper,
            IPrincipal? iPrincipal = null,
            CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal,
                GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration),
                requestContext)
        {
            this.mapper = iMapper;
        }

   
        public async Task<(IEnumerable<PromoCode> Data, int TotalCount)>
            GetPromoCodeListAsync(int page = 1, int pageSize = 20,
            string searchText = null, string sortColumn = "Created",
            string sortOrder = "DESC", bool? isActive = null)
        {
            try
            {
                using (var conn = new SqlConnection(this.ConnectionString))
                {
                    var p = new DynamicParameters();
                    p.Add("@PageIndex", page - 1);
                    p.Add("@PageSize", pageSize);
                    p.Add("@SearchText", searchText);
                    p.Add("@SortColumn", sortColumn);
                    p.Add("@SortOrder", sortOrder);
                    p.Add("@IsActive", isActive);

                    await conn.OpenAsync();

                    var multi = await conn.QueryMultipleAsync(
                        "SP_GetPromoList",
                        p,
                        commandType: CommandType.StoredProcedure
                    );

                    var list = (await multi.ReadAsync<DBO.PromoCode>()).ToList();
                    var total = (await multi.ReadAsync<int>()).FirstOrDefault();

                    return (list.Select(x => mapper.Map<ViewEntities.PromoCode>(x)), total);
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error fetching promo list.", ex);
            }
        }

       
        public async Task<PromoCode> GetPromoByIdAsync(int id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@PromoID", id);

                var data = ExecStoredProcedure<PromoCode>(Database.SP_GetPromoDetailsById, p);

                var item = data.FirstOrDefault();
                return item == null ? null : mapper.Map<PromoCode>(item);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error fetching promo by id.", ex);
            }
        }

      
        public async Task<int> SavePromoAsync(PromoCode promo, IEnumerable<int> skuIds = null)
        {
            try
            {
                using (var conn = new SqlConnection(this.ConnectionString))
                {
                    var p = new DynamicParameters();

                    p.Add("@PromoID", promo.Id);
                    p.Add("@PromoCode", promo.Code);
                    p.Add("@Description", promo.Description);
                    p.Add("@DiscountType", promo.DiscountType);
                    p.Add("@Value", promo.Value);
                    p.Add("@StartDate", promo.StartDate ?? DateTime.Now);
                    p.Add("@EndDate", promo.EndDate ?? DateTime.Now.AddYears(1)); // cannot be null
                    p.Add("@UsageLimit", promo.UsageLimit);
                    p.Add("@PerUserLimit", promo.PerUserLimit);
                    p.Add("@UsedCount", promo.UsedCount);
                    p.Add("@IsActive", promo.IsActive);

                    await conn.OpenAsync();

                    var result = await conn.QueryFirstOrDefaultAsync<int>(
                        "SP_CreateOrUpdatePromo",
                        p,
                        commandType: CommandType.StoredProcedure
                    );

                    int promoId = result;

                    //if (promoId > 0 && skuIds != null)
                    //{
                    //    await AssignSKUsToPromoAsync(promoId, skuIds);
                    //}

                    return promoId;
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error saving promo.", ex);
            }
        }

       
        public async Task<bool> HidePromoAsync(int id)
        {
            try
            {
                using (var conn = new SqlConnection(this.ConnectionString))
                {
                    var p = new DynamicParameters();
                    p.Add("@PromoID", id);
                    p.Add("@IsActive", 0);

                    await conn.OpenAsync();

                    var res = await conn.QueryFirstOrDefaultAsync<int>(
                        Database.SP_TogglePromoStatus,
                        p,
                        commandType: CommandType.StoredProcedure
                    );

                    return res == 1;
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error hiding promo.", ex);
            }
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public PromoCode Get(long id)
        {
            var db = FindItemById(id);
            return db == null ? null : mapper.Map<PromoCode>(db);
        }

        public IEnumerable<PromoCode> GetList()
        {
            throw new NotImplementedException();
        }

        public long Post(PromoCode item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(PromoCode item)
        {
            throw new NotImplementedException();
        }

        public long Put(PromoCode item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(PromoCode item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }

        public async Task<ViewEntities.PromoCode> GetAvailablePromoCode(int customerId, string promoCode)
        {
            try
            {
                if(promoCode == null)
                {
                    return new ViewEntities.PromoCode();
                }

                var today = DateTime.UtcNow;

                var data = this.FindItem(x =>
                    x.Code.ToLower() == promoCode.ToLower() &&
                    x.IsActive == true &&
                    x.StartDate <= today &&
                    x.EndDate >= today
                );

                var mapperResult = this.mapper.Map<DBO.PromoCode, ViewEntities.PromoCode>(data);
                return mapperResult;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error fetching promo.", ex);
            }
        }
    }
}
