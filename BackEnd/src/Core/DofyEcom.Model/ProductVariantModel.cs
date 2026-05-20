using System.Data.SqlClient;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.DAL;
using DofyEcom.DAL;
using DofyEcom.DAL.Interfaces;
using DofyEcom.DAL.Mapper;
using DofyEcom.DBO;
using DofyEcom.Helper;
using DofyEcom.Logger;
using DofyEcom.UploadHelper;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class ProductVariantModel : BaseModel<DBO.ProductVariant>, IProductVariantModel
    {

        private readonly IOptionsSnapshot<AppConfiguration> config;
        private new readonly IMapper mapper;
        private readonly TimeSpan cacheExpiration = TimeSpan.FromMinutes(5);
        private readonly IPrincipal? iPrincipal;
        private readonly CountryContext context;

        public ProductVariantModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        public async Task<int> CreateVariant(ViewEntities.ProductVariant productVariant)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ProductID", productVariant.ProductId);
                parameters.Add("@GradeID", productVariant.GradeId);
                parameters.Add("@ColorID", productVariant.ColorId);
                parameters.Add("@RamID", productVariant.RamId);
                parameters.Add("@StorageID", productVariant.StorageId);
                parameters.Add("@MRP", productVariant.Price);
                parameters.Add("@SellingPrice", productVariant.StatusId);
                parameters.Add("@StockQty", productVariant.StockQty);
                parameters.Add("@StatusID", productVariant.StatusId);
                parameters.Add("@CreatedBy", productVariant.CreatedBy);


                var results = this.ExecStoredProcedure<long>(Database.SP_CreateProductVariant, parameters);
                var productId = results.FirstOrDefault();

                return (int)productId;
            }
            catch (System.Data.SqlClient.SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while creating the variant.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while creating the variant.", ex);
            }
        }

        public async Task<bool> StockAdjustAsync(AdjustVariantStockRequest request)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ProductId", request.ProductId);
                parameters.Add("@VariantID", request.VariantID);
                parameters.Add("@Delta", request.Delta);

                var results = this.ExecStoredProcedure<long>(Database.SP_AdjustVariantStockById, parameters);

                return results.FirstOrDefault() == 1;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while adjusting stock.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while adjusting stock.", ex);
            }
        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }


        Task<bool> IProductVariantModel.DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        byte[] IEntityModel<ViewEntities.ProductVariant>.Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        ViewEntities.ProductVariant IBaseModel<ViewEntities.ProductVariant>.Get(long id)
        {
            throw new NotImplementedException();
        }

        IEnumerable<ViewEntities.ProductVariant> IBaseModel<ViewEntities.ProductVariant>.GetList()
        {
            throw new NotImplementedException();
        }

        long IEntityModel<ViewEntities.ProductVariant>.Post(ViewEntities.ProductVariant item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        long IEntityModel<ViewEntities.ProductVariant>.Post(ViewEntities.ProductVariant item)
        {
            throw new NotImplementedException();
        }

        long IEntityModel<ViewEntities.ProductVariant>.Put(ViewEntities.ProductVariant item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        long IEntityModel<ViewEntities.ProductVariant>.Put(ViewEntities.ProductVariant item)
        {
            throw new NotImplementedException();
        }

        bool IEntityModel<ViewEntities.ProductVariant>.Remove(long id)
        {
            throw new NotImplementedException();
        }
    }
}
