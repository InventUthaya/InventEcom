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

    public class ShoppingCartItemModel : BaseModel<DBO.ShoppingCartItem>, IShoppingCartItemModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public ShoppingCartItemModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal iPrincipal = null, CountryContext requestContext = null)
           : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        public ViewEntities.ShoppingCartItem Get(long id)
        {
            var result = this.GetItem(id);
            //var result = this.FindItem(item => item.Id == id);
            if (result is not null)
            {
                var mapperResult = this.mapper.Map<DBO.ShoppingCartItem, ViewEntities.ShoppingCartItem>(result);

                return mapperResult;
            }

            return default;
        }


        public IEnumerable<ViewEntities.ShoppingCartItem> GetList()
        {
            var results = this.FindItems(item => item.StoreId == 1);
            var mapperResults = this.mapper.Map<IEnumerable<DBO.ShoppingCartItem>, IEnumerable<ViewEntities.ShoppingCartItem>>(results);

            return mapperResults;
        }

        public long Post(ViewEntities.ShoppingCartItem item)
        {
            if (item is not null)
            {
                var mapperResult = this.mapper.Map<ViewEntities.ShoppingCartItem, DBO.ShoppingCartItem>(item);
                mapperResult.BundleItemId = null;
                mapperResult.ParentItemId = null;

                var productid = item.ProductId;
                var param = new
                {
                    ProductId = productid,
                };

                var orderTotalPriceResult = this.GetPagedSProcResult<OrderTotalViewModel>(Database.SP_GetOrderTotal, param);
                var price = orderTotalPriceResult.FirstOrDefault()?.Price ?? 0;
                mapperResult.CustomerEnteredPrice = price;
                //mapperResult.EncryptedId = EncryptAES(item.Id.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
                mapperResult.Id = 0;
                var result = this.AddItem(mapperResult);

                return mapperResult.Id;
            }

            return default;
        }

        public long Post(ShoppingCartItem item, IFormFileCollection postedFileCollection)
        {
            if (item is not null)
            {
                var mapperResult = this.mapper.Map<ViewEntities.ShoppingCartItem, DBO.ShoppingCartItem>(item);
                var result = this.AddItem(mapperResult);

                return mapperResult.Id;
            }

            return default;
        }

        public long Put(ShoppingCartItem item, IFormFileCollection postedFileCollection)
        {
            return default;
        }

        public long Put(ShoppingCartItem item)
        {
            item.Id = this.UserId ?? 0;
            if (item is not null)
            {
                var mapperResult = this.mapper.Map<ViewEntities.ShoppingCartItem, DBO.ShoppingCartItem>(item);
                this.UpdateItem(mapperResult);

                return mapperResult.Id;
            }

            return default;
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }


        public bool Remove(long id)
        {
            var mapperResult = this.FindById(id);
            if (mapperResult is not null)
            {
                this.RemoveItem(mapperResult);
                return true;
            }

            return false;
        }

        public PagedList<ShoppingCartItemViewModel> GetShoppingCartDetails(int customerId)
        {
            var param = new
            {
                UserId = customerId,
            };

            var results = this.GetPagedSProcResult<ShoppingCartItemViewModel>(Database.SP_ShoppingCartDetails, param);
            foreach (var item in results)
            {
                item.EncryptedShoppingCartId = EncryptAES(item.CartId.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
                item.EncryptProductId = EncryptAES(item.ProductId.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
            }

            return results;
        }

        public IEnumerable<ShoppingCartItem> GetShoppingCartByCustomerId(int customerId)
        {
            var result = this.FindItems(item => item.CustomerId == customerId);
            var mapperResult = this.mapper.Map<IEnumerable<DBO.ShoppingCartItem>, IEnumerable<ViewEntities.ShoppingCartItem>>(result);

            return mapperResult;
        }
    }
}
