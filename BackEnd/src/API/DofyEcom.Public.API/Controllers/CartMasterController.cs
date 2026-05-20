using System.Security.Claims;
using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Requests;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DofyEcom.Public.API.Controllers
{
    [Route("api/Cart")]
    [ApiController]
    public class CartMasterController : BaseController<ICartMasterModel, ViewEntities.Cart>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly ICartMasterModel cartModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public CartMasterController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            ICartMasterModel cartModel, CountryContext requestContext)
            : base(cartModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.cartModel = cartModel;
            this.requestContext = requestContext;
        }

        [AllowAnonymous]
        [HttpGet("GetCart")]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCart()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid user token.");

            var cart = this.Contract.GetActiveCartAsync(userId); 
            return Ok(cart);
        }


        [HttpPost]
        [Route("AddToCart")]
        public async Task<long> AddToCart(Cart item)
        {
 
            var result = await Task.Run(() =>
            {
                return this.Contract.AddToCart(item);
            });

            return result;
        }

        [HttpPost("UpdateCartItem/{cartId}")]
        public async Task<Cart> UpdateCartItem(Cart item)
        {
            return await this.Contract.UpdateCartItemAsync(item);
        }

    }
}

