
using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.ViewEntities;
using DofyEcom.Helper;
using DofyEcom.Public.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;

namespace DofyEcom.Public.API.Controllers
{
    [AllowAnonymous]
    [Route("api/ShoppingCartItem")]
    [ApiController]
    public class ShoppingCartItemController : BaseController<IShoppingCartItemModel, ShoppingCartItem>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IShoppingCartItemModel shoppingCartItemModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;
        public ShoppingCartItemController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper, IShoppingCartItemModel ishoppingCartItemModel, CountryContext requestContext)
            : base(ishoppingCartItemModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.shoppingCartItemModel = ishoppingCartItemModel;
            this.requestContext = requestContext;
        }

        [HttpGet]
        [Route("GetShoppingCartItemById")]
        public async Task<ShoppingCartItem> GetById(long id)
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.Get(id);
            });

            return result;
        }

        [HttpGet]
        [Route("GetAllShoppingCartItem")]
        public async Task<IEnumerable<ShoppingCartItem>> GetAllShoppingCartItem()
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.GetList();
            });

            return result;
        }

        [HttpPost]
        [Route("CreateShoppingCartItem")]
        public async Task<List<long>> Create(ShoppingCartItem item)
        {
            var resultIds = new List<long>();

            if (!string.IsNullOrEmpty(item.EncryptCustomerId))
            {
                item.CustomerId = (int)Convert.ToInt64(DecryptAES(item.EncryptCustomerId));
            }

            if (!string.IsNullOrEmpty(item.EncryptProductId))
            {
                var encryptedProductIds = item.EncryptProductId
                    .Split(',', StringSplitOptions.RemoveEmptyEntries);

                foreach (var encryptedProductId in encryptedProductIds)
                {
                    var productId = (int)Convert.ToInt64(DecryptAES(encryptedProductId));

                    var newItem = new ShoppingCartItem
                    {
                        CustomerId = item.CustomerId,
                        StoreId = item.StoreId,
                        Quantity = item.Quantity,
                        ShoppingCartTypeId = item.ShoppingCartTypeId,
                        AttributesXml = item.AttributesXml,
                        CustomerEnteredPrice = item.CustomerEnteredPrice,
                        EncryptCustomerId = null,
                        EncryptProductId = null,
                        ProductId = productId
                    };

                    var result = await Task.Run(() => this.Contract.Post(newItem));
                    resultIds.Add(result);
                }
            }

            return resultIds;
        }


        [HttpPost]
        [Route("GetShoppingCartDetails")]
        public async Task<PagedList<ShoppingCartItemViewModel>> GetShoppingCartDetails(string customerId)
        {
            var id = 0;
            if (!string.IsNullOrEmpty(customerId))
            {
                id = (int)Convert.ToInt64(DecryptAES(customerId.ToString()));
            }
            var result = this.Contract.GetShoppingCartDetails(id);
            return result;
        }

        [HttpGet]
        [Route("Remove/{shoppingId}")]
        public async Task<bool> Remove(string shoppingId)
        {
            var pagedResult = await Task.Run(() =>
            {
                var id = 0;
                if (!string.IsNullOrEmpty(shoppingId))
                {
                    id = (int)Convert.ToInt64(DecryptAES(shoppingId.ToString()));
                }
                var result = this.Contract.Remove(id);

                return result;
            });

            return pagedResult;
        }

        [HttpGet]
        [Route("GetShoppingCartByCustomerId")]
        public async Task<IEnumerable<ShoppingCartItem>> GetShoppingCartByCustomerId(int id)
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.GetShoppingCartByCustomerId(id);
            });

            return result;
        }

    }
}
