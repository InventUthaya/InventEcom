
namespace DofyEcom.Model
{
    using System.Security.Principal;
    using AutoMapper;
    using DataTables.AspNet.Core;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using DofyEcom.ViewEntities;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Options;

    public class CartMasterModel : BaseModel<DBO.Cart>, ICartMasterModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal? iPrincipal;
        private readonly CountryContext context;

        public CartMasterModel(
            IOptionsSnapshot<AppConfiguration> iConfig,
            IMapper iMapper,
            IPrincipal? iPrincipal = null,
            CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal,
                  GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration),
                  requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        public Task<long> AddToCart(ViewEntities.Cart item)
        {
            item.Created = DateTime.Now;
            item.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            item.IsActive = true;
            item.DisplayInList = true;
            var dboCart = mapper.Map<DBO.Cart>(item);
            this.AddItem(dboCart);
            return Task.FromResult(dboCart.Id);
        }

        public Task<Cart> UpdateCartItemAsync(Cart item)
        {
            var data = this.FindItem(x => x.Id == item.Id);

            data.IsActive = item.IsActive;
            data.UserId = item.UserId;
            data.SkuId = item.SkuId;
            data.Quantity = item.Quantity;
            data.DisplayInList = item.DisplayInList;
            this.Update(data);
            return Task.FromResult(item);
        }


        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }

        IEnumerable<ViewEntities.Cart> ICartMasterModel.GetActiveCartAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.Cart item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.Cart item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.Cart item)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.Cart item)
        {
            throw new NotImplementedException();
        }

        IEnumerable<ViewEntities.Cart> IBaseModel<ViewEntities.Cart>.GetList()
        {
            throw new NotImplementedException();
        }

        ViewEntities.Cart IBaseModel<ViewEntities.Cart>.Get(long id)
        {
            throw new NotImplementedException();
        }

       
    }
}
