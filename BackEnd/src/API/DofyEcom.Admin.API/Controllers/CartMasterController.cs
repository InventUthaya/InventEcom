namespace Invent.Api.Controllers
{
    using System.Collections.Generic;
    using System.Security.Claims;
    using System.Security.Principal;
    using System.Threading.Tasks;
    using AutoMapper;
    using DofyEcom.Admin.API.Controllers;
    using DofyEcom.Contracts;
    using DofyEcom.ViewEntities;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    public class CartMasterController : BaseController<ICartMasterModel, Cart>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly ICartMasterModel cartModel;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;

        public CartMasterController(
            IOptionsSnapshot<AppConfiguration> iAppConfiguration,
            IMapper iMapper,
            ICartMasterModel iCartModel,
            IPrincipal iPrincipal = null)
            :base(iCartModel, iAppConfiguration)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.cartModel = iCartModel;
            this.iPrincipal = iPrincipal;
        }


        [HttpGet("GetCart")]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCart()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid user token.");

            var cart = this.Contract.GetActiveCartAsync(userId); // now works
            return Ok(cart);
        }


        //[HttpPost]
        //[Route("AddToCart")]
        //public async Task<Object> AddToCart(int userId,int variantId, int quantity)
        //{
        //    //var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        //    var result = await Task.Run(() =>
        //    {
        //        return this.Contract.AddToCartAsync(userId, variantId, quantity);
        //    });

        //    return result;
        //}

        //[HttpPost("UpdateCartItem/{cartId}")]
        //public async Task<Cart> UpdateCartItem(int userId,int cartId,int request)
        //{
        //    return await this.Contract.UpdateCartItemAsync(userId, cartId, request);
        //}

    }
}
